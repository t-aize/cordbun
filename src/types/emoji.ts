import type { User } from "./user.js";

export interface Emoji {
	id: string | null;
	name: string | null;
	roles?: string[];
	user?: User;
	require_colons?: boolean;
	managed?: boolean;
	animated?: boolean;
	available?: boolean;
}

export interface ListApplicationEmojisResponse {
	items: Emoji[];
}

export interface CreateGuildEmojiParams {
	name: string;
	image: string;
	roles: string[];
}

export interface ModifyGuildEmojiParams {
	name?: string;
	roles?: string[] | null;
}

export interface CreateApplicationEmojiParams {
	name: string;
	image: string;
}

export interface ModifyApplicationEmojiParams {
	name: string;
}
