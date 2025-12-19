import type { Guild } from "./guild.js";
import type { User } from "./user.js";

export interface GuildTemplate {
	code: string;
	name: string;
	description: string | null;
	usage_count: number;
	creator_id: string;
	creator: User;
	created_at: string;
	updated_at: string;
	source_guild_id: string;
	serialized_source_guild: Partial<Guild>;
	is_dirty: boolean | null;
}

export interface CreateGuildTemplateParams {
	name: string;
	description?: string | null;
}

export interface ModifyGuildTemplateParams {
	name?: string;
	description?: string | null;
}
