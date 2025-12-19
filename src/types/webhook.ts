import type { Channel } from "./channel.js";
import type { Guild } from "./guild.js";
import type { AllowedMentions, Attachment, Embed } from "./message.js";
import type { Poll } from "./poll.js";
import type { User } from "./user.js";

export enum WebhookType {
	Incoming = 1,
	ChannelFollower = 2,
	Application = 3,
}

export interface Webhook {
	id: string;
	type: WebhookType;
	guild_id?: string | null;
	channel_id: string | null;
	user?: User;
	name: string | null;
	avatar: string | null;
	token?: string;
	application_id: string | null;
	source_guild?: Partial<Guild>;
	source_channel?: Partial<Channel>;
	url?: string;
}

export interface CreateWebhookParams {
	name: string;
	avatar?: string | null;
}

export interface ModifyWebhookParams {
	name?: string;
	avatar?: string | null;
	channel_id?: string;
}

export interface ExecuteWebhookParams {
	content?: string;
	username?: string;
	avatar_url?: string;
	tts?: boolean;
	embeds?: Embed[];
	allowed_mentions?: AllowedMentions;
	components?: unknown[];
	attachments?: Partial<Attachment>[];
	flags?: number;
	thread_name?: string;
	applied_tags?: string[];
	poll?: Poll;
}

export interface ExecuteWebhookQueryParams {
	wait?: boolean;
	thread_id?: string;
	with_components?: boolean;
}

export interface EditWebhookMessageParams {
	content?: string | null;
	embeds?: Embed[] | null;
	flags?: number;
	allowed_mentions?: AllowedMentions | null;
	components?: unknown[] | null;
	attachments?: Attachment[] | null;
	poll?: Poll;
}

export interface GetWebhookMessageParams {
	thread_id?: string;
}
