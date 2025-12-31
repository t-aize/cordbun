import type { Rest } from "../rest/client.js";
import type { User } from "./users.js";

/**
 * Represents a soundboard sound.
 * @see {@link https://discord.com/developers/docs/resources/soundboard#soundboard-sound-object}
 */
export interface SoundboardSound {
	/** The name of this sound */
	name: string;
	/** The ID of this sound */
	sound_id: string;
	/** The volume of this sound, from 0 to 1 */
	volume: number;
	/** The ID of this sound's custom emoji */
	emoji_id: string | null;
	/** The unicode character of this sound's standard emoji */
	emoji_name: string | null;
	/** The ID of the guild this sound is in */
	guild_id?: string;
	/** Whether this sound can be used, may be false due to loss of Server Boosts */
	available: boolean;
	/** The user who created this sound */
	user?: User;
}

/**
 * Response structure for listing guild soundboard sounds.
 * @see {@link https://discord.com/developers/docs/resources/soundboard#list-guild-soundboard-sounds-response-structure}
 */
export interface ListGuildSoundboardSoundsResponse {
	/** Array of soundboard sound objects */
	items: SoundboardSound[];
}

/**
 * Parameters for sending a soundboard sound to a voice channel.
 * @see {@link https://discord.com/developers/docs/resources/soundboard#send-soundboard-sound-json-params}
 */
export type SendSoundboardSoundParams = Pick<SoundboardSound, "sound_id"> & {
	/** The ID of the guild the soundboard sound is from, required to play sounds from different servers */
	source_guild_id?: string;
};

/**
 * Parameters for creating a guild soundboard sound.
 * @see {@link https://discord.com/developers/docs/resources/soundboard#create-guild-soundboard-sound-json-params}
 */
export type CreateGuildSoundboardSoundParams = Pick<SoundboardSound, "name"> &
	Partial<Pick<SoundboardSound, "volume" | "emoji_id" | "emoji_name">> & {
		/** The mp3 or ogg sound data, base64 encoded, similar to image data */
		sound: string;
	};

/**
 * Parameters for modifying a guild soundboard sound.
 * All parameters are optional.
 * @see {@link https://discord.com/developers/docs/resources/soundboard#modify-guild-soundboard-sound-json-params}
 */
export type ModifyGuildSoundboardSoundParams = Partial<
	Pick<SoundboardSound, "name" | "volume" | "emoji_id" | "emoji_name">
>;

/**
 * API methods for interacting with Discord soundboard sounds.
 * @see {@link https://discord.com/developers/docs/resources/soundboard}
 */
export class SoundboardsAPI {
	private readonly rest: Rest;

	constructor(rest: Rest) {
		this.rest = rest;
	}

	/**
	 * Send a soundboard sound to a voice channel the user is connected to.
	 * Fires a Voice Channel Effect Send Gateway event.
	 *
	 * Requires the `SPEAK` and `USE_SOUNDBOARD` permissions, and also the
	 * `USE_EXTERNAL_SOUNDS` permission if the sound is from a different server.
	 *
	 * @param channelId - The ID of the voice channel
	 * @param params - The parameters for sending the sound
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#send-soundboard-sound}
	 */
	async sendSound(channelId: string, params: SendSoundboardSoundParams): Promise<void> {
		return this.rest.post(`/channels/${channelId}/send-soundboard-sound`, { body: params });
	}

	/**
	 * Returns an array of soundboard sound objects that can be used by all users.
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#list-default-soundboard-sounds}
	 */
	async listDefaultSounds(): Promise<SoundboardSound[]> {
		return this.rest.get("/soundboard-default-sounds");
	}

	/**
	 * Returns a list of the guild's soundboard sounds.
	 * Includes `user` fields if the bot has the `CREATE_GUILD_EXPRESSIONS`
	 * or `MANAGE_GUILD_EXPRESSIONS` permission.
	 *
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#list-guild-soundboard-sounds}
	 */
	async listGuildSounds(guildId: string): Promise<ListGuildSoundboardSoundsResponse> {
		return this.rest.get(`/guilds/${guildId}/soundboard-sounds`);
	}

	/**
	 * Returns a soundboard sound object for the given sound ID.
	 * Includes the `user` field if the bot has the `CREATE_GUILD_EXPRESSIONS`
	 * or `MANAGE_GUILD_EXPRESSIONS` permission.
	 *
	 * @param guildId - The ID of the guild
	 * @param soundId - The ID of the sound
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#get-guild-soundboard-sound}
	 */
	async getGuildSound(guildId: string, soundId: string): Promise<SoundboardSound> {
		return this.rest.get(`/guilds/${guildId}/soundboard-sounds/${soundId}`);
	}

	/**
	 * Create a new soundboard sound for the guild.
	 * Requires the `CREATE_GUILD_EXPRESSIONS` permission.
	 * Fires a Guild Soundboard Sound Create Gateway event.
	 *
	 * Soundboard sounds have a max file size of 512kb and a max duration of 5.2 seconds.
	 *
	 * @param guildId - The ID of the guild
	 * @param params - The parameters for creating the sound
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#create-guild-soundboard-sound}
	 */
	async createGuildSound(
		guildId: string,
		params: CreateGuildSoundboardSoundParams,
		reason?: string,
	): Promise<SoundboardSound> {
		return this.rest.post(`/guilds/${guildId}/soundboard-sounds`, {
			body: params,
			...(reason && { reason }),
		});
	}

	/**
	 * Modify the given soundboard sound.
	 * For sounds created by the current user, requires either the
	 * `CREATE_GUILD_EXPRESSIONS` or `MANAGE_GUILD_EXPRESSIONS` permission.
	 * For other sounds, requires the `MANAGE_GUILD_EXPRESSIONS` permission.
	 * Fires a Guild Soundboard Sound Update Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param soundId - The ID of the sound
	 * @param params - The parameters to modify
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#modify-guild-soundboard-sound}
	 */
	async modifyGuildSound(
		guildId: string,
		soundId: string,
		params: ModifyGuildSoundboardSoundParams,
		reason?: string,
	): Promise<SoundboardSound> {
		return this.rest.patch(`/guilds/${guildId}/soundboard-sounds/${soundId}`, {
			body: params,
			...(reason && { reason }),
		});
	}

	/**
	 * Delete the given soundboard sound.
	 * For sounds created by the current user, requires either the
	 * `CREATE_GUILD_EXPRESSIONS` or `MANAGE_GUILD_EXPRESSIONS` permission.
	 * For other sounds, requires the `MANAGE_GUILD_EXPRESSIONS` permission.
	 * Fires a Guild Soundboard Sound Delete Gateway event.
	 *
	 * @param guildId - The ID of the guild
	 * @param soundId - The ID of the sound
	 * @param reason - Audit log reason
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#delete-guild-soundboard-sound}
	 */
	async deleteGuildSound(guildId: string, soundId: string, reason?: string): Promise<void> {
		return this.rest.delete(`/guilds/${guildId}/soundboard-sounds/${soundId}`, reason ? { reason } : {});
	}
}
