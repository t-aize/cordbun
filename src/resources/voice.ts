import type { REST } from "../rest/index.js";
import type { GuildMember } from "./guilds.js";

/**
 * Represents a user's voice connection status.
 * @see {@link https://discord.com/developers/docs/resources/voice#voice-state-object}
 */
export interface VoiceState {
	/** The guild ID this voice state is for */
	guild_id?: string;
	/** The channel ID this user is connected to */
	channel_id: string | null;
	/** The user ID this voice state is for */
	user_id: string;
	/** The guild member this voice state is for */
	member?: GuildMember;
	/** The session ID for this voice state */
	session_id: string;
	/** Whether this user is deafened by the server */
	deaf: boolean;
	/** Whether this user is muted by the server */
	mute: boolean;
	/** Whether this user is locally deafened */
	self_deaf: boolean;
	/** Whether this user is locally muted */
	self_mute: boolean;
	/** Whether this user is streaming using "Go Live" */
	self_stream?: boolean;
	/** Whether this user's camera is enabled */
	self_video: boolean;
	/** Whether this user's permission to speak is denied */
	suppress: boolean;
	/** The time at which the user requested to speak (ISO8601 timestamp) */
	request_to_speak_timestamp: string | null;
}

/**
 * Represents a voice region that can be used for voice or stage channels.
 * @see {@link https://discord.com/developers/docs/resources/voice#voice-region-object}
 */
export interface VoiceRegion {
	/** Unique ID for the region */
	id: string;
	/** Name of the region */
	name: string;
	/** True for a single server that is closest to the current user's client */
	optimal: boolean;
	/** Whether this is a deprecated voice region (avoid switching to these) */
	deprecated: boolean;
	/** Whether this is a custom voice region (used for events/etc) */
	custom: boolean;
}

/**
 * Parameters for modifying another user's voice state.
 * @see {@link https://discord.com/developers/docs/resources/voice#modify-user-voice-state-json-params}
 */
export type ModifyUserVoiceStateParams = Partial<Pick<VoiceState, "channel_id" | "suppress">>;

/**
 * Parameters for modifying the current user's voice state.
 * @see {@link https://discord.com/developers/docs/resources/voice#modify-current-user-voice-state-json-params}
 */
export type ModifyCurrentUserVoiceStateParams = ModifyUserVoiceStateParams &
	Partial<Pick<VoiceState, "request_to_speak_timestamp">>;

/**
 * API methods for interacting with Discord voice.
 * @see {@link https://discord.com/developers/docs/resources/voice}
 */
export class VoiceAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Returns an array of voice region objects that can be used when setting
	 * a voice or stage channel's `rtc_region`.
	 * @see {@link https://discord.com/developers/docs/resources/voice#list-voice-regions}
	 */
	async listRegions(): Promise<VoiceRegion[]> {
		return this.rest.get("/voice/regions");
	}

	/**
	 * Returns the current user's voice state in the guild.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/voice#get-current-user-voice-state}
	 */
	async getCurrentUserVoiceState(guildId: string): Promise<VoiceState> {
		return this.rest.get(`/guilds/${guildId}/voice-states/@me`);
	}

	/**
	 * Returns the specified user's voice state in the guild.
	 * @param guildId - The ID of the guild
	 * @param userId - The ID of the user
	 * @see {@link https://discord.com/developers/docs/resources/voice#get-user-voice-state}
	 */
	async getUserVoiceState(guildId: string, userId: string): Promise<VoiceState> {
		return this.rest.get(`/guilds/${guildId}/voice-states/${userId}`);
	}

	/**
	 * Updates the current user's voice state.
	 * Fires a Voice State Update Gateway event.
	 *
	 * Caveats:
	 * - `channel_id` must currently point to a stage channel.
	 * - Current user must already have joined `channel_id`.
	 * - You must have the `MUTE_MEMBERS` permission to unsuppress yourself. You can always suppress yourself.
	 * - You must have the `REQUEST_TO_SPEAK` permission to request to speak. You can always clear your own request to speak.
	 * - You are able to set `request_to_speak_timestamp` to any present or future time.
	 *
	 * @param guildId - The ID of the guild
	 * @param params - The parameters to update
	 * @see {@link https://discord.com/developers/docs/resources/voice#modify-current-user-voice-state}
	 */
	async modifyCurrentUserVoiceState(guildId: string, params: ModifyCurrentUserVoiceStateParams): Promise<void> {
		return this.rest.patch(`/guilds/${guildId}/voice-states/@me`, { body: params });
	}

	/**
	 * Updates another user's voice state.
	 * Fires a Voice State Update Gateway event.
	 *
	 * Caveats:
	 * - `channel_id` must currently point to a stage channel.
	 * - User must already have joined `channel_id`.
	 * - You must have the `MUTE_MEMBERS` permission.
	 * - When unsuppressed, non-bot users will have their `request_to_speak_timestamp` set to the current time. Bot users will not.
	 * - When suppressed, the user will have their `request_to_speak_timestamp` removed.
	 *
	 * @param guildId - The ID of the guild
	 * @param userId - The ID of the user
	 * @param params - The parameters to update
	 * @see {@link https://discord.com/developers/docs/resources/voice#modify-user-voice-state}
	 */
	async modifyUserVoiceState(guildId: string, userId: string, params: ModifyUserVoiceStateParams): Promise<void> {
		return this.rest.patch(`/guilds/${guildId}/voice-states/${userId}`, { body: params });
	}
}
