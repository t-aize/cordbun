import { GatewayOpcode } from "../constants/index.js";
import { Rest } from "../rest/index.js";
import type { GatewayEventName, GatewayEvents } from "./events.js";
import { createShard, type Shard } from "./shard.js";
import {
	GATEWAY_VERSION,
	type GatewayBotInfo,
	type GatewayOptions,
	type GatewayPresenceUpdate,
	type RequestGuildMembersData,
	type RequestSoundboardSoundsData,
	type ShardOptions,
	type ShardState,
	type VoiceStateUpdateData,
} from "./types.js";

type EventHandler<T extends GatewayEventName> = (
	data: GatewayEvents[T],
) => void;

export interface Gateway {
	connect: () => Promise<void>;
	disconnect: () => void;
	on: <T extends GatewayEventName>(
		event: T,
		handler: EventHandler<T>,
	) => () => void;
	off: <T extends GatewayEventName>(event: T, handler: EventHandler<T>) => void;
	updatePresence: (presence: GatewayPresenceUpdate) => void;
	updateVoiceState: (data: VoiceStateUpdateData) => void;
	requestGuildMembers: (data: RequestGuildMembersData) => void;
	requestSoundboardSounds: (data: RequestSoundboardSoundsData) => void;
	getShardForGuild: (guildId: string) => Shard | undefined;
	readonly shards: Map<number, Shard>;
	readonly shardStates: ShardState[];
	readonly latency: number;
}

export interface GatewayClientOptions extends GatewayOptions {
	token: string;
}

const validateOptions = (options: GatewayClientOptions): void => {
	if (!options.token || typeof options.token !== "string") {
		throw new TypeError("Invalid token: Must be a non-empty string");
	}

	if (typeof options.intents !== "number" || options.intents < 0) {
		throw new TypeError("Invalid intents: Must be a non-negative number");
	}

	if (options.largeThreshold !== undefined) {
		if (
			!Number.isInteger(options.largeThreshold) ||
			options.largeThreshold < 50 ||
			options.largeThreshold > 250
		) {
			throw new TypeError(
				"Invalid largeThreshold: Must be an integer between 50 and 250",
			);
		}
	}

	if (options.shards !== undefined && options.shards !== "auto") {
		if (
			!Array.isArray(options.shards) ||
			options.shards.length !== 2 ||
			!Number.isInteger(options.shards[0]) ||
			!Number.isInteger(options.shards[1]) ||
			options.shards[0] < 0 ||
			options.shards[1] < 1 ||
			options.shards[0] >= options.shards[1]
		) {
			throw new TypeError(
				'Invalid shards: Must be "auto" or [shard_id, num_shards]',
			);
		}
	}
};

export const createGateway = (options: GatewayClientOptions): Gateway => {
	validateOptions(options);

	const rest = new Rest(options.token);
	const shards = new Map<number, Shard>();
	const handlers: Map<
		GatewayEventName,
		Set<EventHandler<GatewayEventName>>
	> = new Map();

	let shardCount = 1;
	let shardIds: number[] = [0];
	let maxConcurrency = 1;

	const emit = <T extends GatewayEventName>(
		event: T,
		data: GatewayEvents[T],
	): void => {
		const eventHandlers = handlers.get(event);
		if (eventHandlers) {
			for (const handler of eventHandlers) {
				(handler as EventHandler<T>)(data);
			}
		}
	};

	const createShardOptions = (id: number): ShardOptions => ({
		id,
		total: shardCount,
		token: options.token,
		intents: options.intents,
		largeThreshold: options.largeThreshold,
		presence: options.presence,
		compress: options.compress,
		encoding: options.encoding ?? "json",
		transportCompression: options.transportCompression,
		version: options.version ?? GATEWAY_VERSION,
	});

	const setupShardEvents = (shard: Shard): void => {
		for (const event of handlers.keys()) {
			shard.on(event, (data) => emit(event, data));
		}
	};

	const spawnShards = async (): Promise<void> => {
		const buckets: number[][] = [];

		for (const id of shardIds) {
			const bucketKey = id % maxConcurrency;
			if (!buckets[bucketKey]) {
				buckets[bucketKey] = [];
			}
			buckets[bucketKey].push(id);
		}

		for (const bucket of buckets) {
			if (!bucket) continue;

			await Promise.all(
				bucket.map(async (id) => {
					const shard = createShard(createShardOptions(id));
					shards.set(id, shard);
					setupShardEvents(shard);
					await shard.connect();
				}),
			);

			if (bucket !== buckets[buckets.length - 1]) {
				await Bun.sleep(5000);
			}
		}
	};

	const connect = async (): Promise<void> => {
		if (options.shards === "auto" || options.shards === undefined) {
			const gatewayInfo = await rest.get<GatewayBotInfo>("/gateway/bot");
			shardCount = gatewayInfo.shards;
			maxConcurrency = gatewayInfo.session_start_limit.max_concurrency;
			shardIds = Array.from({ length: shardCount }, (_, i) => i);
		} else {
			shardIds = [options.shards[0]];
			shardCount = options.shards[1];
		}

		await spawnShards();
	};

	const disconnect = (): void => {
		for (const shard of shards.values()) {
			shard.disconnect();
		}
		shards.clear();
	};

	const on = <T extends GatewayEventName>(
		event: T,
		handler: EventHandler<T>,
	): (() => void) => {
		if (!handlers.has(event)) {
			handlers.set(event, new Set());
		}
		handlers.get(event)?.add(handler as EventHandler<GatewayEventName>);

		for (const shard of shards.values()) {
			shard.on(event, handler);
		}

		return () => off(event, handler);
	};

	const off = <T extends GatewayEventName>(
		event: T,
		handler: EventHandler<T>,
	): void => {
		handlers.get(event)?.delete(handler as EventHandler<GatewayEventName>);
		for (const shard of shards.values()) {
			shard.off(event, handler);
		}
	};

	const getShardIdForGuild = (guildId: string): number => {
		return Number((BigInt(guildId) >> 22n) % BigInt(shardCount));
	};

	const getShardForGuild = (guildId: string): Shard | undefined => {
		const shardId = getShardIdForGuild(guildId);
		return shards.get(shardId);
	};

	const updatePresence = (presence: GatewayPresenceUpdate): void => {
		for (const shard of shards.values()) {
			shard.updatePresence(presence);
		}
	};

	const updateVoiceState = (data: VoiceStateUpdateData): void => {
		const shard = getShardForGuild(data.guild_id);
		shard?.send(GatewayOpcode.VoiceStateUpdate, data);
	};

	const requestGuildMembers = (data: RequestGuildMembersData): void => {
		const shard = getShardForGuild(data.guild_id);
		shard?.send(GatewayOpcode.RequestGuildMembers, data);
	};

	const requestSoundboardSounds = (data: RequestSoundboardSoundsData): void => {
		const firstGuild = data.guild_ids[0];
		if (!firstGuild) return;
		const shard = getShardForGuild(firstGuild);
		shard?.send(GatewayOpcode.RequestSoundboardSounds, data);
	};

	return {
		connect,
		disconnect,
		on,
		off,
		updatePresence,
		updateVoiceState,
		requestGuildMembers,
		requestSoundboardSounds,
		getShardForGuild,
		get shards() {
			return shards;
		},
		get shardStates() {
			return Array.from(shards.values()).map((s) => s.state);
		},
		get latency() {
			const latencies = Array.from(shards.values())
				.map((s) => s.state.latency)
				.filter((l) => l >= 0);
			if (latencies.length === 0) return -1;
			return latencies.reduce((a, b) => a + b, 0) / latencies.length;
		},
	};
};
