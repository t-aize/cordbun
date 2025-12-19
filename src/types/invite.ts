import type { Application } from "./application.js";
import type { Channel } from "./channel.js";
import type { Guild, GuildMember } from "./guild.js";
import type { GuildScheduledEvent } from "./guild-scheduled-event.js";
import type { User } from "./user.js";

export enum InviteType {
	Guild = 0,
	GroupDm = 1,
	Friend = 2,
}

export enum InviteTargetType {
	Stream = 1,
	EmbeddedApplication = 2,
}

export enum GuildInviteFlags {
	IsGuestInvite = 1 << 0,
}

export interface Invite {
	type: InviteType;
	code: string;
	guild?: Partial<Guild>;
	channel: Partial<Channel> | null;
	inviter?: User;
	target_type?: InviteTargetType;
	target_user?: User;
	target_application?: Partial<Application>;
	approximate_presence_count?: number;
	approximate_member_count?: number;
	expires_at: string | null;
	guild_scheduled_event?: GuildScheduledEvent;
	flags?: GuildInviteFlags;
}

export interface InviteMetadata {
	uses: number;
	max_uses: number;
	max_age: number;
	temporary: boolean;
	created_at: string;
}

export interface InviteStageInstance {
	members: Partial<GuildMember>[];
	participant_count: number;
	speaker_count: number;
	topic: string;
}

export interface GetInviteParams {
	with_counts?: boolean;
	guild_scheduled_event_id?: string;
}
