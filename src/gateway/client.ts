import { EventEmitter } from "node:events";
import { ApiVersion, GatewayCloseCode, GatewayOpcode } from "../constants/index.js";
import type { GatewayClientEvents, GatewayDispatchEventName } from "./events.js";
import {
	type GatewayHello,
	type GatewayIdentify,
	type GatewayOptions,
	type GatewayPayload,
	type GatewayPresenceUpdate,
	type GatewayReady,
	type GatewayRequestGuildMembers,
	type GatewayRequestSoundboardSounds,
	type GatewayResume,
	GatewayStatus,
	type GatewayVoiceStateUpdate,
	type ResolvedGatewayOptions,
} from "./types.js";

const GATEWAY_URL = "wss://gateway.discord.gg";
const LIB_NAME = "cordbun";

/** Close codes that indicate we should not attempt to reconnect */
const NON_RECONNECTABLE_CLOSE_CODES: number[] = [
	GatewayCloseCode.AuthenticationFailed,
	GatewayCloseCode.InvalidShard,
	GatewayCloseCode.ShardingRequired,
	GatewayCloseCode.InvalidApiVersion,
	GatewayCloseCode.InvalidIntents,
	GatewayCloseCode.DisallowedIntents,
];

/**
 * Gateway client for maintaining a WebSocket connection with Discord.
 * Handles heartbeating, identifying, resuming, and event dispatching.
 *
 * @example
 * ```typescript
 * const gateway = new Gateway("Bot YOUR_TOKEN", {
 *   intents: GatewayIntent.Guilds | GatewayIntent.GuildMessages,
 * });
 *
 * gateway.on("ready", (data) => {
 *   console.log(`Logged in as ${data.user.username}`);
 * });
 *
 * gateway.on("dispatch", (eventName, data) => {
 *   console.log(`Received event: ${eventName}`);
 * });
 *
 * await gateway.connect();
 * ```
 *
 * @see {@link https://discord.com/developers/docs/events/gateway}
 */
export class Gateway extends EventEmitter<GatewayClientEvents> {
	/** Current connection status */
	public status: GatewayStatus = GatewayStatus.Idle;

	/** The session ID from the Ready event */
	public sessionId: string | null = null;

	/** The resume gateway URL from the Ready event */
	public resumeGatewayUrl: string | null = null;

	/** The last sequence number received */
	public sequence: number | null = null;

	/** The latency of the last heartbeat in milliseconds */
	public ping = -1;

	private readonly token: string;
	private readonly options: ResolvedGatewayOptions;
	private ws: WebSocket | null = null;
	private heartbeatInterval: Timer | null = null;
	private heartbeatTimeout: Timer | null = null;
	private heartbeatAckReceived = true;
	private lastHeartbeatSent = 0;
	private reconnectAttempts = 0;
	private readonly maxReconnectAttempts = 5;
	private reconnectTimeout: Timer | null = null;

	/**
	 * Creates a new Gateway client.
	 * @param token - The bot token (without "Bot" prefix)
	 * @param options - Gateway configuration options
	 */
	constructor(token: string, options: GatewayOptions) {
		super();
		this.token = token;
		this.options = this.resolveOptions(options);
	}

	/**
	 * Connects to the Discord Gateway.
	 * @returns A promise that resolves when the connection is established and ready
	 */
	async connect(): Promise<void> {
		if (this.status !== GatewayStatus.Idle && this.status !== GatewayStatus.Disconnected) {
			throw new Error("Gateway is already connecting or connected");
		}

		return new Promise((resolve, reject) => {
			const url = this.buildGatewayUrl();
			this.debug(`Connecting to ${url}`);
			this.setStatus(GatewayStatus.Connecting);

			this.ws = new WebSocket(url);

			const onReady = () => {
				this.removeListener("error", onError);
				resolve();
			};

			const onError = (error: Error) => {
				this.removeListener("ready", onReady);
				reject(error);
			};

			this.once("ready", onReady);
			this.once("error", onError);

			this.ws.onopen = () => {
				this.debug("WebSocket connection opened");
			};

			this.ws.onmessage = (event) => {
				this.handleMessage(event.data as string);
			};

			this.ws.onclose = (event) => {
				this.handleClose(event.code, event.reason);
			};

			this.ws.onerror = (event) => {
				this.emit("error", new Error(`WebSocket error: ${event}`));
			};
		});
	}

	/**
	 * Disconnects from the Discord Gateway.
	 * @param code - The close code to send (default: 1000)
	 * @param reason - The close reason to send
	 */
	disconnect(code = 1000, reason = "Client disconnect"): void {
		this.cleanup();
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.close(code, reason);
		}
		this.setStatus(GatewayStatus.Idle);
		this.sessionId = null;
		this.resumeGatewayUrl = null;
		this.sequence = null;
	}

	/**
	 * Updates the client's presence.
	 * @param presence - The presence update payload
	 * @see {@link https://discord.com/developers/docs/events/gateway-events#update-presence}
	 */
	updatePresence(presence: GatewayPresenceUpdate): void {
		this.send(GatewayOpcode.PresenceUpdate, presence);
	}

	/**
	 * Joins, moves, or disconnects from a voice channel.
	 * @param data - The voice state update payload
	 * @see {@link https://discord.com/developers/docs/events/gateway-events#update-voice-state}
	 */
	updateVoiceState(data: GatewayVoiceStateUpdate): void {
		this.send(GatewayOpcode.VoiceStateUpdate, data);
	}

	/**
	 * Requests guild members for a guild.
	 * @param data - The request guild members payload
	 * @see {@link https://discord.com/developers/docs/events/gateway-events#request-guild-members}
	 */
	requestGuildMembers(data: GatewayRequestGuildMembers): void {
		this.send(GatewayOpcode.RequestGuildMembers, data);
	}

	/**
	 * Requests soundboard sounds for a list of guilds.
	 * @param data - The request soundboard sounds payload
	 * @see {@link https://discord.com/developers/docs/events/gateway-events#request-soundboard-sounds}
	 */
	requestSoundboardSounds(data: GatewayRequestSoundboardSounds): void {
		this.send(GatewayOpcode.RequestSoundboardSounds, data);
	}

	/**
	 * Sends a payload to the Gateway.
	 * @param op - The opcode
	 * @param data - The payload data
	 */
	private send<T>(op: GatewayOpcode, data: T): void {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			throw new Error("WebSocket is not connected");
		}

		const payload: GatewayPayload<T> = { op, d: data, s: null, t: null };
		this.ws.send(JSON.stringify(payload));
	}

	/**
	 * Handles an incoming WebSocket message.
	 */
	private handleMessage(data: string): void {
		let payload: GatewayPayload;
		try {
			payload = JSON.parse(data);
		} catch {
			this.debug("Failed to parse gateway payload");
			return;
		}

		this.emit("raw", payload);

		if (payload.s !== null) {
			this.sequence = payload.s;
		}

		switch (payload.op) {
			case GatewayOpcode.Dispatch:
				this.handleDispatch(payload.t!, payload.d);
				break;
			case GatewayOpcode.Heartbeat:
				this.sendHeartbeat();
				break;
			case GatewayOpcode.Reconnect:
				this.debug("Received reconnect opcode");
				this.reconnect();
				break;
			case GatewayOpcode.InvalidSession:
				this.handleInvalidSession(payload.d as boolean);
				break;
			case GatewayOpcode.Hello:
				this.handleHello(payload.d as GatewayHello);
				break;
			case GatewayOpcode.HeartbeatAck:
				this.handleHeartbeatAck();
				break;
		}
	}

	/**
	 * Handles a dispatch event.
	 */
	private handleDispatch(eventName: string, data: unknown): void {
		this.emit("dispatch", eventName as GatewayDispatchEventName, data);

		switch (eventName) {
			case "READY": {
				const ready = data as GatewayReady;
				this.sessionId = ready.session_id;
				this.resumeGatewayUrl = ready.resume_gateway_url;
				this.reconnectAttempts = 0;
				this.setStatus(GatewayStatus.Ready);
				this.emit("ready", ready);
				break;
			}
			case "RESUMED":
				this.reconnectAttempts = 0;
				this.setStatus(GatewayStatus.Ready);
				this.emit("resumed");
				break;
		}
	}

	/**
	 * Handles the Hello event.
	 */
	private handleHello(data: GatewayHello): void {
		this.debug(`Received Hello with heartbeat interval: ${data.heartbeat_interval}ms`);
		this.startHeartbeat(data.heartbeat_interval);

		if (this.sessionId && this.sequence !== null) {
			this.resume();
		} else {
			this.identify();
		}
	}

	/**
	 * Handles an invalid session event.
	 */
	private handleInvalidSession(resumable: boolean): void {
		this.debug(`Invalid session, resumable: ${resumable}`);

		if (resumable) {
			setTimeout(() => this.resume(), 1000 + Math.random() * 4000);
		} else {
			this.sessionId = null;
			this.sequence = null;
			setTimeout(() => this.identify(), 1000 + Math.random() * 4000);
		}
	}

	/**
	 * Handles a heartbeat ACK.
	 */
	private handleHeartbeatAck(): void {
		this.heartbeatAckReceived = true;
		this.ping = Date.now() - this.lastHeartbeatSent;
		this.debug(`Heartbeat ACK received, ping: ${this.ping}ms`);
	}

	/**
	 * Handles a WebSocket close event.
	 */
	private handleClose(code: number, reason: string): void {
		this.debug(`WebSocket closed with code ${code}: ${reason}`);
		this.cleanup();

		const closeEvent = { code, reason, wasClean: code === 1000 };
		this.emit("close", closeEvent);

		if (NON_RECONNECTABLE_CLOSE_CODES.includes(code)) {
			this.debug("Non-reconnectable close code, not attempting to reconnect");
			this.setStatus(GatewayStatus.Idle);
			this.emit("error", new Error(`Gateway closed with non-reconnectable code: ${code} - ${reason}`));
			return;
		}

		this.setStatus(GatewayStatus.Disconnected);
		this.scheduleReconnect();
	}

	/**
	 * Sends an identify payload.
	 */
	private identify(): void {
		this.debug("Identifying with gateway");
		this.setStatus(GatewayStatus.Identifying);

		const payload: GatewayIdentify = {
			token: this.token,
			intents: this.options.intents,
			properties: this.options.properties,
			compress: this.options.compress,
			large_threshold: this.options.largeThreshold,
		};

		if (this.options.presence) {
			payload.presence = this.options.presence;
		}

		this.send(GatewayOpcode.Identify, payload);
	}

	/**
	 * Sends a resume payload.
	 */
	private resume(): void {
		if (!this.sessionId || this.sequence === null) {
			this.debug("Cannot resume: missing session ID or sequence");
			this.identify();
			return;
		}

		this.debug(`Resuming session ${this.sessionId} at sequence ${this.sequence}`);
		this.setStatus(GatewayStatus.Resuming);

		const payload: GatewayResume = {
			token: this.token,
			session_id: this.sessionId,
			seq: this.sequence,
		};

		this.send(GatewayOpcode.Resume, payload);
	}

	/**
	 * Starts the heartbeat interval.
	 */
	private startHeartbeat(interval: number): void {
		this.stopHeartbeat();

		// Send first heartbeat after jitter
		const jitter = Math.random();
		this.heartbeatTimeout = setTimeout(() => {
			this.heartbeatTimeout = null;
			if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
			this.sendHeartbeat();
			this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), interval);
		}, interval * jitter);
	}

	/**
	 * Stops the heartbeat interval.
	 */
	private stopHeartbeat(): void {
		if (this.heartbeatTimeout) {
			clearTimeout(this.heartbeatTimeout);
			this.heartbeatTimeout = null;
		}
		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval);
			this.heartbeatInterval = null;
		}
	}

	/**
	 * Sends a heartbeat.
	 */
	private sendHeartbeat(): void {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			return;
		}

		if (!this.heartbeatAckReceived) {
			this.debug("Heartbeat ACK not received, reconnecting (zombied connection)");
			this.reconnect();
			return;
		}

		this.heartbeatAckReceived = false;
		this.lastHeartbeatSent = Date.now();
		this.send(GatewayOpcode.Heartbeat, this.sequence);
	}

	/**
	 * Schedules a reconnect attempt.
	 */
	private scheduleReconnect(): void {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			this.debug("Max reconnect attempts reached");
			this.emit("error", new Error("Max reconnect attempts reached"));
			return;
		}

		const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
		this.reconnectAttempts++;

		this.debug(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

		this.reconnectTimeout = setTimeout(() => {
			this.reconnect();
		}, delay);
	}

	/**
	 * Reconnects to the gateway.
	 */
	private reconnect(): void {
		this.cleanup();

		if (this.ws) {
			this.ws.close(4000, "Reconnecting");
			this.ws = null;
		}

		const url = this.resumeGatewayUrl
			? `${this.resumeGatewayUrl}?v=${this.options.version}&encoding=json`
			: this.buildGatewayUrl();

		this.debug(`Reconnecting to ${url}`);
		this.setStatus(GatewayStatus.Connecting);

		this.ws = new WebSocket(url);

		this.ws.onopen = () => {
			this.debug("WebSocket reconnection opened");
		};

		this.ws.onmessage = (event) => {
			this.handleMessage(event.data as string);
		};

		this.ws.onclose = (event) => {
			this.handleClose(event.code, event.reason);
		};

		this.ws.onerror = (event) => {
			this.emit("error", new Error(`WebSocket error: ${event}`));
		};
	}

	/**
	 * Cleans up timers and intervals.
	 */
	private cleanup(): void {
		this.stopHeartbeat();
		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
			this.reconnectTimeout = null;
		}
	}

	/**
	 * Sets the gateway status and emits the statusChange event.
	 */
	private setStatus(status: GatewayStatus): void {
		if (this.status !== status) {
			this.status = status;
			this.emit("statusChange", status);
		}
	}

	/**
	 * Builds the gateway URL with query parameters.
	 */
	private buildGatewayUrl(): string {
		const params = new URLSearchParams({
			v: this.options.version.toString(),
			encoding: "json",
		});

		return `${GATEWAY_URL}/?${params.toString()}`;
	}

	/**
	 * Resolves gateway options with defaults.
	 */
	private resolveOptions(options: GatewayOptions): ResolvedGatewayOptions {
		const resolved: ResolvedGatewayOptions = {
			intents: options.intents,
			version: options.version ?? ApiVersion.V10,
			compress: options.compress ?? false,
			largeThreshold: options.largeThreshold ?? 50,
			properties: {
				os: options.properties?.os ?? process.platform,
				browser: options.properties?.browser ?? LIB_NAME,
				device: options.properties?.device ?? LIB_NAME,
			},
		};

		if (options.presence) {
			resolved.presence = options.presence;
		}

		return resolved;
	}

	/**
	 * Emits a debug message.
	 */
	private debug(message: string): void {
		this.emit("debug", `[Gateway] ${message}`);
	}

	/**
	 * Destroys the gateway client and cleans up all resources.
	 */
	destroy(): void {
		this.disconnect();
		this.removeAllListeners();
	}
}
