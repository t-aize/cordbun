import { GatewayCloseCode } from "../constants/index.js";

export type GatewayEncoding = "json" | "etf";
export type GatewayCompression = "zlib-stream" | "zstd-stream";

export type PresenceStatus = "online" | "dnd" | "idle" | "invisible" | "offline";

export interface Activity {
	name: string;
	type: ActivityType;
	url?: string | null;
	created_at?: number;
	timestamps?: ActivityTimestamps;
	application_id?: string;
	details?: string | null;
	state?: string | null;
	emoji?: ActivityEmoji | null;
	party?: ActivityParty;
	assets?: ActivityAssets;
	secrets?: ActivitySecrets;
	instance?: boolean;
	flags?: number;
	buttons?: ActivityButton[];
}

export enum ActivityType {
	Playing = 0,
	Streaming = 1,
	Listening = 2,
	Watching = 3,
	Custom = 4,
	Competing = 5,
}

export interface ActivityTimestamps {
	start?: number;
	end?: number;
}

export interface ActivityEmoji {
	name: string;
	id?: string;
	animated?: boolean;
}

export interface ActivityParty {
	id?: string;
	size?: [number, number];
}

export interface ActivityAssets {
	large_image?: string;
	large_text?: string;
	small_image?: string;
	small_text?: string;
}

export interface ActivitySecrets {
	join?: string;
	spectate?: string;
	match?: string;
}

export interface ActivityButton {
	label: string;
	url: string;
}

export interface GatewayOptions {
	intents: number;
	shards?: "auto" | [number, number];
	largeThreshold?: number;
	presence?: GatewayPresenceUpdate;
	compress?: boolean;
	encoding?: GatewayEncoding;
	transportCompression?: GatewayCompression;
	version?: number;
}

export interface ShardOptions {
	id: number;
	total: number;
	token: string;
	intents: number;
	largeThreshold?: number | undefined;
	presence?: GatewayPresenceUpdate | undefined;
	compress?: boolean | undefined;
	encoding: GatewayEncoding;
	transportCompression?: GatewayCompression | undefined;
	version: number;
}

export interface GatewayPayload<T = unknown> {
	op: number;
	d: T;
	s: number | null;
	t: string | null;
}

export interface HelloData {
	heartbeat_interval: number;
}

export interface ReadyData {
	v: number;
	user: GatewayUser;
	guilds: GatewayUnavailableGuild[];
	session_id: string;
	resume_gateway_url: string;
	shard?: [number, number];
	application: PartialApplication;
}

export interface GatewayUser {
	id: string;
	username: string;
	discriminator: string;
	global_name: string | null;
	avatar: string | null;
	bot?: boolean;
	system?: boolean;
	mfa_enabled?: boolean;
	banner?: string | null;
	accent_color?: number | null;
	locale?: string;
	verified?: boolean;
	email?: string | null;
	flags?: number;
	premium_type?: number;
	public_flags?: number;
}

export interface GatewayUnavailableGuild {
	id: string;
	unavailable: true;
}

export interface PartialApplication {
	id: string;
	flags: number;
}

export interface IdentifyData {
	token: string;
	properties: IdentifyConnectionProperties;
	compress?: boolean;
	large_threshold?: number;
	shard?: [number, number];
	presence?: GatewayPresenceUpdate;
	intents: number;
}

export interface IdentifyConnectionProperties {
	os: string;
	browser: string;
	device: string;
}

export interface ResumeData {
	token: string;
	session_id: string;
	seq: number;
}

export interface GatewayPresenceUpdate {
	since: number | null;
	activities: Activity[];
	status: PresenceStatus;
	afk: boolean;
}

export interface VoiceStateUpdateData {
	guild_id: string;
	channel_id: string | null;
	self_mute: boolean;
	self_deaf: boolean;
}

export interface RequestGuildMembersData {
	guild_id: string;
	query?: string;
	limit: number;
	presences?: boolean;
	user_ids?: string | string[];
	nonce?: string;
}

export interface RequestSoundboardSoundsData {
	guild_ids: string[];
}

export interface SessionStartLimit {
	total: number;
	remaining: number;
	reset_after: number;
	max_concurrency: number;
}

export interface GatewayBotInfo {
	url: string;
	shards: number;
	session_start_limit: SessionStartLimit;
}

export interface ShardState {
	id: number;
	status: ShardStatus;
	sessionId: string | null;
	resumeUrl: string | null;
	sequence: number | null;
	latency: number;
	lastHeartbeat: number;
	lastHeartbeatAck: number;
}

export type ShardStatus = "disconnected" | "connecting" | "identifying" | "resuming" | "ready" | "reconnecting";

export const GATEWAY_VERSION = 10;
export const GATEWAY_URL = "wss://gateway.discord.gg";

export const RESUMABLE_CLOSE_CODES = new Set<number>([
	GatewayCloseCode.UnknownError,
	GatewayCloseCode.UnknownOpcode,
	GatewayCloseCode.DecodeError,
	GatewayCloseCode.NotAuthenticated,
	GatewayCloseCode.AlreadyAuthenticated,
	GatewayCloseCode.InvalidSeq,
	GatewayCloseCode.RateLimited,
	GatewayCloseCode.SessionTimedOut,
]);

export const NON_RESUMABLE_CLOSE_CODES = new Set<number>([
	GatewayCloseCode.AuthenticationFailed,
	GatewayCloseCode.InvalidShard,
	GatewayCloseCode.ShardingRequired,
	GatewayCloseCode.InvalidApiVersion,
	GatewayCloseCode.InvalidIntents,
	GatewayCloseCode.DisallowedIntents,
]);
