import type { GuildMember } from "./guilds.js";
import type { AllowedMentions, Attachment, Embed } from "./messages.js";
import type { User } from "./users.js";
import type { PaginationParams } from "./utils.js";

export enum ChannelType {
	GuildText = 0,
	Dm = 1,
	GuildVoice = 2,
	GroupDm = 3,
	GuildCategory = 4,
	GuildAnnouncement = 5,
	AnnouncementThread = 10,
	PublicThread = 11,
	PrivateThread = 12,
	GuildStageVoice = 13,
	GuildDirectory = 14,
	GuildForum = 15,
	GuildMedia = 16,
}

export enum VideoQualityMode {
	Auto = 1,
	Full = 2,
}

export enum ChannelFlags {
	Pinned = 1 << 1,
	RequireTag = 1 << 4,
	HideMediaDownloadOptions = 1 << 15,
}

export enum SortOrderType {
	LatestActivity = 0,
	CreationDate = 1,
}

export enum ForumLayoutType {
	NotSet = 0,
	ListView = 1,
	GalleryView = 2,
}

export enum OverwriteType {
	Role = 0,
	Member = 1,
}

export interface Overwrite {
	id: string;
	type: OverwriteType;
	allow: string;
	deny: string;
}

export interface ThreadMetadata {
	archived: boolean;
	auto_archive_duration: number;
	archive_timestamp: string;
	locked: boolean;
	invitable?: boolean;
	create_timestamp?: string | null;
}

export interface ThreadMember {
	id?: string;
	user_id?: string;
	join_timestamp: string;
	flags: number;
	member?: GuildMember;
}

export interface DefaultReaction {
	emoji_id: string | null;
	emoji_name: string | null;
}

export interface ForumTag {
	id: string;
	name: string;
	moderated: boolean;
	emoji_id: string | null;
	emoji_name: string | null;
}

export interface Channel {
	id: string;
	type: ChannelType;
	guild_id?: string;
	position?: number;
	permission_overwrites?: Overwrite[];
	name?: string | null;
	topic?: string | null;
	nsfw?: boolean;
	last_message_id?: string | null;
	bitrate?: number;
	user_limit?: number;
	rate_limit_per_user?: number;
	recipients?: User[];
	icon?: string | null;
	owner_id?: string;
	application_id?: string;
	managed?: boolean;
	parent_id?: string | null;
	last_pin_timestamp?: string | null;
	rtc_region?: string | null;
	video_quality_mode?: VideoQualityMode;
	message_count?: number;
	member_count?: number;
	thread_metadata?: ThreadMetadata;
	member?: ThreadMember;
	default_auto_archive_duration?: number;
	permissions?: string;
	flags?: ChannelFlags;
	total_message_sent?: number;
	available_tags?: ForumTag[];
	applied_tags?: string[];
	default_reaction_emoji?: DefaultReaction | null;
	default_thread_rate_limit_per_user?: number;
	default_sort_order?: SortOrderType | null;
	default_forum_layout?: ForumLayoutType;
}

export interface FollowedChannel {
	channel_id: string;
	webhook_id: string;
}

export type ModifyChannelParams = Partial<
	Pick<
		Channel,
		| "name"
		| "type"
		| "flags"
		| "available_tags"
		| "default_reaction_emoji"
		| "default_thread_rate_limit_per_user"
		| "default_forum_layout"
	>
> & {
	position?: number | null;
	topic?: string | null;
	nsfw?: boolean | null;
	rate_limit_per_user?: number | null;
	bitrate?: number | null;
	user_limit?: number | null;
	permission_overwrites?: Partial<Overwrite>[] | null;
	parent_id?: string | null;
	rtc_region?: string | null;
	video_quality_mode?: VideoQualityMode | null;
	default_auto_archive_duration?: number | null;
	default_sort_order?: SortOrderType | null;
};

export type EditChannelPermissionsParams = Partial<Pick<Overwrite, "allow" | "deny">> & Pick<Overwrite, "type">;

export interface CreateChannelInviteParams {
	max_age?: number;
	max_uses?: number;
	temporary?: boolean;
	unique?: boolean;
	target_type?: number;
	target_user_id?: string;
	target_application_id?: string;
}

export interface FollowAnnouncementChannelParams {
	webhook_channel_id: string;
}

export interface GroupDmAddRecipientParams {
	access_token: string;
	nick: string;
}

export interface StartThreadFromMessageParams {
	name: string;
	auto_archive_duration?: number;
	rate_limit_per_user?: number | null;
}

export interface StartThreadWithoutMessageParams {
	name: string;
	auto_archive_duration?: number;
	type?: ChannelType;
	invitable?: boolean;
	rate_limit_per_user?: number | null;
}

export interface ForumThreadMessageParams {
	content?: string;
	embeds?: Embed[];
	allowed_mentions?: AllowedMentions;
	components?: unknown[];
	sticker_ids?: string[];
	attachments?: Partial<Attachment>[];
	flags?: number;
}

export interface StartThreadInForumOrMediaChannelParams {
	name: string;
	auto_archive_duration?: number;
	rate_limit_per_user?: number | null;
	message: ForumThreadMessageParams;
	applied_tags?: string[];
}

export type ListThreadMembersParams = Pick<PaginationParams, "after" | "limit"> & {
	with_member?: boolean;
};

export type ListArchivedThreadsParams = Pick<PaginationParams, "before" | "limit">;

export interface ListArchivedThreadsResponse {
	threads: Channel[];
	members: ThreadMember[];
	has_more: boolean;
}
