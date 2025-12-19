import type { User } from "./user.js";

export interface SoundboardSound {
	name: string;
	sound_id: string;
	volume: number;
	emoji_id: string | null;
	emoji_name: string | null;
	guild_id?: string;
	available: boolean;
	user?: User;
}

export interface ListGuildSoundboardSoundsResponse {
	items: SoundboardSound[];
}

export interface SendSoundboardSoundParams {
	sound_id: string;
	source_guild_id?: string;
}

export interface CreateGuildSoundboardSoundParams {
	name: string;
	sound: string;
	volume?: number | null;
	emoji_id?: string | null;
	emoji_name?: string | null;
}

export interface ModifyGuildSoundboardSoundParams {
	name?: string;
	volume?: number | null;
	emoji_id?: string | null;
	emoji_name?: string | null;
}
