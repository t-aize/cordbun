import type { ApiVersion, GatewayCloseCode, GatewayOpcode } from "../constants/index.js";
import type { UnavailableGuild } from "../resources/guilds.js";

/**
 * Gateway payload structure.
 * All gateway events are encapsulated in this payload structure.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#payload-structure}
 */
export interface GatewayPayload<T = unknown> {
	/** Gateway opcode, which indicates the payload type */
	op: GatewayOpcode;
	/** Event data */
	d: T;
	/** Sequence number of event used for resuming sessions and heartbeating (null when op is not 0) */
	s: number | null;
	/** Event name (null when op is not 0) */
	t: string | null;
}

/**
 * Configuration options for the Gateway client.
 */
export interface GatewayOptions {
	/** Gateway intents you wish to receive */
	intents: number;
	/** The Discord API version to use (default: 10) */
	version?: ApiVersion;
	/** Whether this connection supports compression of packets (default: false) */
	compress?: boolean;
	/** Value between 50 and 250, total number of members where the gateway will stop sending offline members (default: 50) */
	largeThreshold?: number;
	/** Initial presence information */
	presence?: GatewayPresenceUpdate;
	/** Custom properties for the identify payload */
	properties?: Partial<IdentifyConnectionProperties>;
}

/**
 * Connection properties sent with the Identify payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#identify-identify-connection-properties}
 */
export interface IdentifyConnectionProperties {
	/** Your operating system */
	os: string;
	/** Your library name */
	browser: string;
	/** Your library name */
	device: string;
}

/**
 * Identify payload structure.
 * Used to trigger the initial handshake with the gateway.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#identify-identify-structure}
 */
export interface GatewayIdentify {
	/** Authentication token */
	token: string;
	/** Connection properties */
	properties: IdentifyConnectionProperties;
	/** Whether this connection supports compression of packets */
	compress?: boolean;
	/** Value between 50 and 250, total number of members where the gateway will stop sending offline members */
	large_threshold?: number;
	/** Presence structure for initial presence information */
	presence?: GatewayPresenceUpdate;
	/** Gateway Intents you wish to receive */
	intents: number;
}

/**
 * Resume payload structure.
 * Used to replay missed events when a disconnected client resumes.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#resume-resume-structure}
 */
export interface GatewayResume {
	/** Session token */
	token: string;
	/** Session ID */
	session_id: string;
	/** Last sequence number received */
	seq: number;
}

/**
 * Hello event payload.
 * Sent on connection to the websocket, defines the heartbeat interval.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#hello-hello-structure}
 */
export interface GatewayHello {
	/** Interval (in milliseconds) an app should heartbeat with */
	heartbeat_interval: number;
}

/**
 * Ready event payload.
 * Contains the initial state information after completing the handshake.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#ready-ready-event-fields}
 */
export interface GatewayReady {
	/** API version */
	v: number;
	/** Information about the user including email */
	user: GatewayUser;
	/** Guilds the user is in (as unavailable guild objects) */
	guilds: UnavailableGuild[];
	/** Used for resuming connections */
	session_id: string;
	/** Gateway URL for resuming connections */
	resume_gateway_url: string;
	/** Contains `id` and `flags` of the application */
	application: { id: string; flags: number };
}

/**
 * Minimal user object for gateway events.
 */
export interface GatewayUser {
	/** The user's ID */
	id: string;
	/** The user's username */
	username: string;
	/** The user's discriminator */
	discriminator: string;
	/** The user's display name */
	global_name: string | null;
	/** The user's avatar hash */
	avatar: string | null;
	/** Whether the user is a bot */
	bot?: boolean;
}

/**
 * Gateway presence update structure.
 * Sent by the client to indicate a presence or status update.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#update-presence-gateway-presence-update-structure}
 */
export interface GatewayPresenceUpdate {
	/** Unix time (in milliseconds) of when the client went idle, or null if the client is not idle */
	since: number | null;
	/** User's activities */
	activities: GatewayActivity[];
	/** User's new status */
	status: StatusType;
	/** Whether or not the client is afk */
	afk: boolean;
}

/**
 * Status types for presence updates.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#update-presence-status-types}
 */
export type StatusType = "online" | "dnd" | "idle" | "invisible" | "offline";

/**
 * Activity object for presence updates.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object}
 */
export interface GatewayActivity {
	/** Activity's name */
	name: string;
	/** Activity type */
	type: ActivityType;
	/** Stream URL, is validated when type is 1 */
	url?: string | null;
}

/**
 * Activity types.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object-activity-types}
 */
export enum ActivityType {
	/** Playing {name} */
	Playing = 0,
	/** Streaming {details} */
	Streaming = 1,
	/** Listening to {name} */
	Listening = 2,
	/** Watching {name} */
	Watching = 3,
	/** {emoji} {state} */
	Custom = 4,
	/** Competing in {name} */
	Competing = 5,
}

/**
 * Gateway voice state update structure.
 * Sent when a client wants to join, move, or disconnect from a voice channel.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#update-voice-state-gateway-voice-state-update-structure}
 */
export interface GatewayVoiceStateUpdate {
	/** ID of the guild */
	guild_id: string;
	/** ID of the voice channel client wants to join (null if disconnecting) */
	channel_id: string | null;
	/** Whether the client is muted */
	self_mute: boolean;
	/** Whether the client is deafened */
	self_deaf: boolean;
}

/**
 * Request guild members structure.
 * Used to request all members for a guild or a list of guilds.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#request-guild-members-request-guild-members-structure}
 */
export interface GatewayRequestGuildMembers {
	/** ID of the guild to get members for */
	guild_id: string;
	/** String that username starts with, or an empty string to return all members */
	query?: string;
	/** Maximum number of members to send matching the query; a limit of 0 can be used with an empty string query to return all members */
	limit: number;
	/** Used to specify if we want the presences of the matched members */
	presences?: boolean;
	/** Used to specify which users you wish to fetch */
	user_ids?: string | string[];
	/** Nonce to identify the Guild Members Chunk response */
	nonce?: string;
}

/**
 * Request soundboard sounds structure.
 * Used to request soundboard sounds for a list of guilds.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#request-soundboard-sounds-request-soundboard-sounds-structure}
 */
export interface GatewayRequestSoundboardSounds {
	/** IDs of the guilds to get soundboard sounds for */
	guild_ids: string[];
}

/**
 * Gateway close event information.
 */
export interface GatewayCloseEvent {
	/** The close code */
	code: GatewayCloseCode | number;
	/** The close reason */
	reason: string;
	/** Whether this was a clean close */
	wasClean: boolean;
}

/**
 * Internal state of the Gateway connection.
 */
export enum GatewayStatus {
	/** Not connected */
	Idle = 0,
	/** Connecting to the gateway */
	Connecting = 1,
	/** Connected and identifying */
	Identifying = 2,
	/** Resuming a previous session */
	Resuming = 3,
	/** Connected and ready */
	Ready = 4,
	/** Disconnected, will reconnect */
	Disconnected = 5,
}

/**
 * Resolved gateway options with defaults applied.
 */
export interface ResolvedGatewayOptions {
	/** Gateway intents you wish to receive */
	intents: number;
	/** The Discord API version to use */
	version: ApiVersion;
	/** Whether this connection supports compression of packets */
	compress: boolean;
	/** Value between 50 and 250, total number of members where the gateway will stop sending offline members */
	largeThreshold: number;
	/** Initial presence information */
	presence?: GatewayPresenceUpdate;
	/** Connection properties for the identify payload */
	properties: IdentifyConnectionProperties;
}
