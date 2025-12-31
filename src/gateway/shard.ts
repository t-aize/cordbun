import { GatewayOpcode } from "../constants/index.js";
import type { GatewayEventName, GatewayEvents } from "./events.js";
import {
	GATEWAY_URL,
	GATEWAY_VERSION,
	type GatewayPayload,
	type HelloData,
	type IdentifyConnectionProperties,
	type IdentifyData,
	NON_RESUMABLE_CLOSE_CODES,
	RESUMABLE_CLOSE_CODES,
	type ReadyData,
	type ResumeData,
	type ShardOptions,
	type ShardState,
	type ShardStatus,
} from "./types.js";

let erlpack: typeof import("erlpack") | null = null;

try {
	erlpack = await import("erlpack");
} catch {
	erlpack = null;
}

type EventHandler<T extends GatewayEventName> = (data: GatewayEvents[T]) => void;
type EventHandlers = {
	[K in GatewayEventName]?: Set<EventHandler<K>>;
};

export interface Shard {
	readonly state: ShardState;
	connect: () => Promise<void>;
	disconnect: (code?: number) => void;
	send: <T>(op: GatewayOpcode, data: T) => void;
	on: <T extends GatewayEventName>(event: T, handler: EventHandler<T>) => () => void;
	off: <T extends GatewayEventName>(event: T, handler: EventHandler<T>) => void;
	updatePresence: (data: IdentifyData["presence"]) => void;
}

export const createShard = (options: ShardOptions): Shard => {
	let ws: WebSocket | null = null;
	let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
	let heartbeatTimeout: ReturnType<typeof setTimeout> | null = null;
	let reconnectAttempts = 0;
	const maxReconnectAttempts = 5;

	const state: ShardState = {
		id: options.id,
		status: "disconnected",
		sessionId: null,
		resumeUrl: null,
		sequence: null,
		latency: -1,
		lastHeartbeat: 0,
		lastHeartbeatAck: 0,
	};

	const handlers: EventHandlers = {};

	const encoding = options.encoding;
	const useEtf = encoding === "etf" && erlpack !== null;

	const buildGatewayUrl = (resume = false): string => {
		const base = resume && state.resumeUrl ? state.resumeUrl : GATEWAY_URL;
		const params = new URLSearchParams({
			v: String(options.version ?? GATEWAY_VERSION),
			encoding: useEtf ? "etf" : "json",
		});

		if (options.transportCompression) {
			params.set("compress", options.transportCompression);
		}

		return `${base}/?${params}`;
	};

	const pack = (data: unknown): string | ArrayBuffer => {
		if (useEtf && erlpack) {
			const packed = erlpack.pack(data);
			return new Uint8Array(packed).buffer as ArrayBuffer;
		}
		return JSON.stringify(data);
	};

	const unpack = (data: string | ArrayBuffer): unknown => {
		if (useEtf && erlpack && data instanceof ArrayBuffer) {
			return erlpack.unpack(Buffer.from(data));
		}
		if (typeof data === "string") {
			return JSON.parse(data);
		}
		return JSON.parse(new TextDecoder().decode(data));
	};

	const emit = <T extends GatewayEventName>(event: T, data: GatewayEvents[T]): void => {
		const eventHandlers = handlers[event] as Set<EventHandler<T>> | undefined;
		if (eventHandlers) {
			for (const handler of eventHandlers) {
				handler(data);
			}
		}
	};

	const setStatus = (status: ShardStatus): void => {
		state.status = status;
	};

	const sendPayload = <T>(op: GatewayOpcode, d: T): void => {
		if (!ws || ws.readyState !== WebSocket.OPEN) return;

		const payload: GatewayPayload<T> = { op, d, s: null, t: null };
		ws.send(pack(payload));
	};

	const identify = (): void => {
		setStatus("identifying");

		const properties: IdentifyConnectionProperties = {
			os: process.platform,
			browser: "cordbun",
			device: "cordbun",
		};

		const data: IdentifyData = {
			token: options.token,
			properties,
			intents: options.intents,
			...(options.compress && { compress: options.compress }),
			...(options.largeThreshold && {
				large_threshold: options.largeThreshold,
			}),
			...(options.total > 1 && { shard: [options.id, options.total] }),
			...(options.presence && { presence: options.presence }),
		};

		sendPayload(GatewayOpcode.Identify, data);
	};

	const resume = (): void => {
		if (!state.sessionId || state.sequence === null) {
			identify();
			return;
		}

		setStatus("resuming");

		const data: ResumeData = {
			token: options.token,
			session_id: state.sessionId,
			seq: state.sequence,
		};

		sendPayload(GatewayOpcode.Resume, data);
	};

	const heartbeat = (): void => {
		if (!ws || ws.readyState !== WebSocket.OPEN) return;

		state.lastHeartbeat = Date.now();
		sendPayload(GatewayOpcode.Heartbeat, state.sequence);

		heartbeatTimeout = setTimeout(() => {
			if (ws) {
				ws.close(4000, "Heartbeat timeout");
			}
		}, 15000);
	};

	const startHeartbeat = (interval: number): void => {
		if (heartbeatInterval) clearInterval(heartbeatInterval);

		const jitter = Math.random();
		setTimeout(() => {
			heartbeat();
			heartbeatInterval = setInterval(heartbeat, interval);
		}, interval * jitter);
	};

	const stopHeartbeat = (): void => {
		if (heartbeatInterval) {
			clearInterval(heartbeatInterval);
			heartbeatInterval = null;
		}
		if (heartbeatTimeout) {
			clearTimeout(heartbeatTimeout);
			heartbeatTimeout = null;
		}
	};

	const handleMessage = (event: MessageEvent): void => {
		const payload = unpack(event.data) as GatewayPayload;

		if (payload.s !== null) {
			state.sequence = payload.s;
		}

		switch (payload.op) {
			case GatewayOpcode.Dispatch:
				handleDispatch(payload);
				break;

			case GatewayOpcode.Heartbeat:
				heartbeat();
				break;

			case GatewayOpcode.Reconnect:
				emit("reconnect", null);
				ws?.close(4000, "Reconnect requested");
				break;

			case GatewayOpcode.InvalidSession:
				emit("invalid_session", payload.d as boolean);
				if (payload.d) {
					setTimeout(resume, 1000 + Math.random() * 4000);
				} else {
					state.sessionId = null;
					state.sequence = null;
					setTimeout(identify, 1000 + Math.random() * 4000);
				}
				break;

			case GatewayOpcode.Hello:
				startHeartbeat((payload.d as HelloData).heartbeat_interval);
				if (state.sessionId && state.sequence !== null) {
					resume();
				} else {
					identify();
				}
				break;

			case GatewayOpcode.HeartbeatAck:
				if (heartbeatTimeout) {
					clearTimeout(heartbeatTimeout);
					heartbeatTimeout = null;
				}
				state.lastHeartbeatAck = Date.now();
				state.latency = state.lastHeartbeatAck - state.lastHeartbeat;
				break;
		}
	};

	const handleDispatch = (payload: GatewayPayload): void => {
		const eventName = payload.t?.toLowerCase() as GatewayEventName | undefined;
		if (!eventName) return;

		if (eventName === "ready") {
			const data = payload.d as ReadyData;
			state.sessionId = data.session_id;
			state.resumeUrl = data.resume_gateway_url;
			setStatus("ready");
			reconnectAttempts = 0;
		}

		if (eventName === "resumed") {
			setStatus("ready");
			reconnectAttempts = 0;
		}

		emit(eventName, payload.d as GatewayEvents[typeof eventName]);
	};

	const handleClose = (event: CloseEvent): void => {
		stopHeartbeat();
		setStatus("disconnected");

		if (NON_RESUMABLE_CLOSE_CODES.has(event.code)) {
			state.sessionId = null;
			state.sequence = null;
			state.resumeUrl = null;
			return;
		}

		if (RESUMABLE_CLOSE_CODES.has(event.code) || event.code === 1006 || event.code < 4000) {
			if (reconnectAttempts < maxReconnectAttempts) {
				reconnectAttempts++;
				const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000);
				setTimeout(() => connect(true), delay);
			}
		}
	};

	const handleError = (_event: Event): void => {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.close(4000, "WebSocket error");
		}
	};

	const connect = async (isResume = false): Promise<void> => {
		if (ws) {
			ws.close(1000);
			ws = null;
		}

		setStatus(isResume ? "reconnecting" : "connecting");

		const url = buildGatewayUrl(isResume);
		ws = new WebSocket(url);

		if (useEtf) {
			ws.binaryType = "arraybuffer";
		}

		ws.onmessage = handleMessage;
		ws.onclose = handleClose;
		ws.onerror = handleError;

		await new Promise<void>((resolve, reject) => {
			if (!ws) return reject(new Error("WebSocket not initialized"));

			ws.onopen = () => resolve();
			ws.onerror = (e) => reject(e);
		});
	};

	const disconnect = (code = 1000): void => {
		stopHeartbeat();
		if (ws) {
			ws.close(code);
			ws = null;
		}
		setStatus("disconnected");
	};

	const on = <T extends GatewayEventName>(event: T, handler: EventHandler<T>): (() => void) => {
		if (!handlers[event]) {
			handlers[event] = new Set() as EventHandlers[T];
		}
		(handlers[event] as Set<EventHandler<T>>).add(handler);

		return () => off(event, handler);
	};

	const off = <T extends GatewayEventName>(event: T, handler: EventHandler<T>): void => {
		(handlers[event] as Set<EventHandler<T>> | undefined)?.delete(handler);
	};

	const updatePresence = (data: IdentifyData["presence"]): void => {
		sendPayload(GatewayOpcode.PresenceUpdate, data);
	};

	return {
		get state() {
			return state;
		},
		connect,
		disconnect,
		send: sendPayload,
		on,
		off,
		updatePresence,
	};
};
