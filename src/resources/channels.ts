import type { GuildMember } from "./guilds.js";
import type { AllowedMentions, Attachment, Embed } from "./messages.js";
import type { User } from "./users.js";
import type { PaginationParams } from "./utils.js";

/**
 * The type of a channel.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-types}
 */
export enum ChannelType {
	/** A text channel within a server */
	GuildText = 0,
	/** A direct message between users */
	Dm = 1,
	/** A voice channel within a server */
	GuildVoice = 2,
	/** A direct message between multiple users */
	GroupDm = 3,
	/** An organizational category that contains up to 50 channels */
	GuildCategory = 4,
	/** A channel that users can follow and crosspost into their own server */
	GuildAnnouncement = 5,
	/** A temporary sub-channel within a GUILD_ANNOUNCEMENT channel */
	AnnouncementThread = 10,
	/** A temporary sub-channel within a GUILD_TEXT or GUILD_FORUM channel */
	PublicThread = 11,
	/** A temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission */
	PrivateThread = 12,
	/** A voice channel for hosting events with an audience */
	GuildStageVoice = 13,
	/** The channel in a hub containing the listed servers */
	GuildDirectory = 14,
	/** Channel that can only contain threads */
	GuildForum = 15,
	/** Channel that can only contain threads, similar to GUILD_FORUM channels */
	GuildMedia = 16,
}

/**
 * The camera video quality mode of a voice channel.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes}
 */
export enum VideoQualityMode {
	/** Discord chooses the quality for optimal performance */
	Auto = 1,
	/** 720p */
	Full = 2,
}

/**
 * Channel flags combined as a bitfield.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-flags}
 */
export enum ChannelFlags {
	/** This thread is pinned to the top of its parent GUILD_FORUM or GUILD_MEDIA channel */
	Pinned = 1 << 1,
	/** Whether a tag is required to be specified when creating a thread in a GUILD_FORUM or GUILD_MEDIA channel */
	RequireTag = 1 << 4,
	/** When set, hides the embedded media download options. Available only for media channels */
	HideMediaDownloadOptions = 1 << 15,
}

/**
 * The default sort order type used to order posts in GUILD_FORUM and GUILD_MEDIA channels.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-sort-order-types}
 */
export enum SortOrderType {
	/** Sort forum posts by activity */
	LatestActivity = 0,
	/** Sort forum posts by creation time (from most recent to oldest) */
	CreationDate = 1,
}

/**
 * The default forum layout view used to display posts in GUILD_FORUM channels.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-forum-layout-types}
 */
export enum ForumLayoutType {
	/** No default has been set for forum channel */
	NotSet = 0,
	/** Display posts as a list */
	ListView = 1,
	/** Display posts as a collection of tiles */
	GalleryView = 2,
}

/**
 * The type of a permission overwrite: role or member.
 * @see {@link https://discord.com/developers/docs/resources/channel#overwrite-object}
 */
export enum OverwriteType {
	/** Permission overwrite for a role */
	Role = 0,
	/** Permission overwrite for a member */
	Member = 1,
}

/**
 * Represents a permission overwrite for a role or member in a channel.
 * @see {@link https://discord.com/developers/docs/resources/channel#overwrite-object}
 */
export interface Overwrite {
	/** Role or user ID */
	id: string;
	/** Either 0 (role) or 1 (member) */
	type: OverwriteType;
	/** Permission bit set for allowed permissions */
	allow: string;
	/** Permission bit set for denied permissions */
	deny: string;
}

/**
 * Thread-specific fields not needed by other channel types.
 * @see {@link https://discord.com/developers/docs/resources/channel#thread-metadata-object}
 */
export interface ThreadMetadata {
	/** Whether the thread is archived */
	archived: boolean;
	/** The thread will stop showing in the channel list after this many minutes of inactivity (60, 1440, 4320, 10080) */
	auto_archive_duration: number;
	/** Timestamp when the thread's archive status was last changed, used for calculating recent activity */
	archive_timestamp: string;
	/** Whether the thread is locked; when locked, only users with MANAGE_THREADS can unarchive it */
	locked: boolean;
	/** Whether non-moderators can add other non-moderators to the thread; only available on private threads */
	invitable?: boolean;
	/** Timestamp when the thread was created; only populated for threads created after 2022-01-09 */
	create_timestamp?: string | null;
}

/**
 * Contains information about a user that has joined a thread.
 * @see {@link https://discord.com/developers/docs/resources/channel#thread-member-object}
 */
export interface ThreadMember {
	/** ID of the thread */
	id?: string;
	/** ID of the user */
	user_id?: string;
	/** Time the user last joined the thread */
	join_timestamp: string;
	/** Any user-thread settings, currently only used for notifications */
	flags: number;
	/** Additional information about the user */
	member?: GuildMember;
}

/**
 * Specifies the emoji to use as the default way to react to a forum post.
 * Exactly one of `emoji_id` and `emoji_name` must be set.
 * @see {@link https://discord.com/developers/docs/resources/channel#default-reaction-object}
 */
export interface DefaultReaction {
	/** The ID of a guild's custom emoji */
	emoji_id: string | null;
	/** The unicode character of the emoji */
	emoji_name: string | null;
}

/**
 * Represents a tag that can be applied to a thread in a GUILD_FORUM or GUILD_MEDIA channel.
 * @see {@link https://discord.com/developers/docs/resources/channel#forum-tag-object}
 */
export interface ForumTag {
	/** The ID of the tag */
	id: string;
	/** The name of the tag (0-20 characters) */
	name: string;
	/** Whether this tag can only be added to or removed from threads by a member with the MANAGE_THREADS permission */
	moderated: boolean;
	/** The ID of a guild's custom emoji */
	emoji_id: string | null;
	/** The unicode character of the emoji */
	emoji_name: string | null;
}

/**
 * Represents a guild or DM channel within Discord.
 * This is the base channel object that contains all possible fields across all channel types.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object}
 */
export interface Channel {
	/** The ID of this channel */
	id: string;
	/** The type of channel */
	type: ChannelType;
	/** The ID of the guild (may be missing for some channel objects received over gateway guild dispatches) */
	guild_id?: string;
	/** Sorting position of the channel (channels with the same position are sorted by id) */
	position?: number;
	/** Explicit permission overwrites for members and roles */
	permission_overwrites?: Overwrite[];
	/** The name of the channel (1-100 characters) */
	name?: string | null;
	/** The channel topic (0-4096 characters for GUILD_FORUM and GUILD_MEDIA channels, 0-1024 characters for all others) */
	topic?: string | null;
	/** Whether the channel is NSFW */
	nsfw?: boolean;
	/** The ID of the last message sent in this channel (or thread for GUILD_FORUM or GUILD_MEDIA channels) */
	last_message_id?: string | null;
	/** The bitrate (in bits) of the voice channel */
	bitrate?: number;
	/** The user limit of the voice channel */
	user_limit?: number;
	/** Amount of seconds a user has to wait before sending another message (0-21600); also applies to thread creation */
	rate_limit_per_user?: number;
	/** The recipients of the DM */
	recipients?: User[];
	/** Icon hash of the group DM */
	icon?: string | null;
	/** ID of the creator of the group DM or thread */
	owner_id?: string;
	/** Application ID of the group DM creator if it is bot-created */
	application_id?: string;
	/** For group DM channels: whether the channel is managed by an application via the `gdm.join` OAuth2 scope */
	managed?: boolean;
	/** For guild channels: ID of the parent category; for threads: ID of the text channel this thread was created in */
	parent_id?: string | null;
	/** When the last pinned message was pinned */
	last_pin_timestamp?: string | null;
	/** Voice region ID for the voice channel, automatic when set to null */
	rtc_region?: string | null;
	/** The camera video quality mode of the voice channel, 1 when not present */
	video_quality_mode?: VideoQualityMode;
	/** Number of messages (not including the initial message or deleted messages) in a thread */
	message_count?: number;
	/** An approximate count of users in a thread, stops counting at 50 */
	member_count?: number;
	/** Thread-specific fields not needed by other channels */
	thread_metadata?: ThreadMetadata;
	/** Thread member object for the current user, if they have joined the thread */
	member?: ThreadMember;
	/** Default duration, copied onto newly created threads, in minutes (60, 1440, 4320, 10080) */
	default_auto_archive_duration?: number;
	/** Computed permissions for the invoking user in the channel, including overwrites */
	permissions?: string;
	/** Channel flags combined as a bitfield */
	flags?: ChannelFlags;
	/** Number of messages ever sent in a thread; does not decrement when a message is deleted */
	total_message_sent?: number;
	/** The set of tags that can be used in a GUILD_FORUM or GUILD_MEDIA channel */
	available_tags?: ForumTag[];
	/** The IDs of the set of tags that have been applied to a thread in a GUILD_FORUM or GUILD_MEDIA channel */
	applied_tags?: string[];
	/** The emoji to show in the add reaction button on a thread in a GUILD_FORUM or GUILD_MEDIA channel */
	default_reaction_emoji?: DefaultReaction | null;
	/** The initial rate_limit_per_user to set on newly created threads in a channel */
	default_thread_rate_limit_per_user?: number;
	/** The default sort order type used to order posts in GUILD_FORUM and GUILD_MEDIA channels */
	default_sort_order?: SortOrderType | null;
	/** The default forum layout view used to display posts in GUILD_FORUM channels */
	default_forum_layout?: ForumLayoutType;
}

/**
 * A text channel within a server.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-example-guild-text-channel}
 */
export type GuildTextChannel = Pick<
	Channel,
	| "id"
	| "guild_id"
	| "position"
	| "permission_overwrites"
	| "name"
	| "topic"
	| "nsfw"
	| "last_message_id"
	| "rate_limit_per_user"
	| "parent_id"
	| "last_pin_timestamp"
	| "default_auto_archive_duration"
	| "default_thread_rate_limit_per_user"
	| "permissions"
	| "flags"
> & {
	/** The type of channel */
	type: ChannelType.GuildText;
};

/**
 * A direct message between two users.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-example-dm-channel}
 */
export type DmChannel = Pick<Channel, "id" | "last_message_id" | "recipients" | "last_pin_timestamp" | "flags"> & {
	/** The type of channel */
	type: ChannelType.Dm;
};

/**
 * A voice channel within a server.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-example-guild-voice-channel}
 */
export type GuildVoiceChannel = Pick<
	Channel,
	| "id"
	| "guild_id"
	| "position"
	| "permission_overwrites"
	| "name"
	| "nsfw"
	| "last_message_id"
	| "bitrate"
	| "user_limit"
	| "rate_limit_per_user"
	| "parent_id"
	| "rtc_region"
	| "video_quality_mode"
	| "permissions"
	| "flags"
> & {
	/** The type of channel */
	type: ChannelType.GuildVoice;
};

/**
 * A direct message between multiple users.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-example-group-dm-channel}
 */
export type GroupDmChannel = Pick<
	Channel,
	"id" | "name" | "last_message_id" | "recipients" | "icon" | "owner_id" | "application_id" | "managed" | "flags"
> & {
	/** The type of channel */
	type: ChannelType.GroupDm;
};

/**
 * An organizational category that contains up to 50 channels.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-example-channel-category}
 */
export type GuildCategoryChannel = Pick<
	Channel,
	"id" | "guild_id" | "position" | "permission_overwrites" | "name" | "nsfw" | "parent_id" | "permissions" | "flags"
> & {
	/** The type of channel */
	type: ChannelType.GuildCategory;
};

/**
 * A channel that users can follow and crosspost into their own server (formerly news channels).
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-example-guild-announcement-channel}
 */
export type GuildAnnouncementChannel = Pick<
	Channel,
	| "id"
	| "guild_id"
	| "position"
	| "permission_overwrites"
	| "name"
	| "topic"
	| "nsfw"
	| "last_message_id"
	| "parent_id"
	| "last_pin_timestamp"
	| "default_auto_archive_duration"
	| "permissions"
	| "flags"
> & {
	/** The type of channel */
	type: ChannelType.GuildAnnouncement;
};

/**
 * A temporary sub-channel within a GUILD_ANNOUNCEMENT channel.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-example-thread-channel}
 */
export type AnnouncementThreadChannel = Pick<
	Channel,
	| "id"
	| "guild_id"
	| "name"
	| "last_message_id"
	| "rate_limit_per_user"
	| "owner_id"
	| "parent_id"
	| "message_count"
	| "member_count"
	| "thread_metadata"
	| "member"
	| "flags"
	| "total_message_sent"
	| "permissions"
> & {
	/** The type of channel */
	type: ChannelType.AnnouncementThread;
};

/**
 * A temporary sub-channel within a GUILD_TEXT or GUILD_FORUM channel.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-example-thread-channel}
 */
export type PublicThreadChannel = Pick<
	Channel,
	| "id"
	| "guild_id"
	| "name"
	| "last_message_id"
	| "rate_limit_per_user"
	| "owner_id"
	| "parent_id"
	| "message_count"
	| "member_count"
	| "thread_metadata"
	| "member"
	| "flags"
	| "total_message_sent"
	| "applied_tags"
	| "permissions"
> & {
	/** The type of channel */
	type: ChannelType.PublicThread;
};

/**
 * A temporary sub-channel within a GUILD_TEXT channel that is only viewable
 * by those invited and those with the MANAGE_THREADS permission.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-example-thread-channel}
 */
export type PrivateThreadChannel = Pick<
	Channel,
	| "id"
	| "guild_id"
	| "name"
	| "last_message_id"
	| "rate_limit_per_user"
	| "owner_id"
	| "parent_id"
	| "message_count"
	| "member_count"
	| "thread_metadata"
	| "member"
	| "flags"
	| "total_message_sent"
	| "permissions"
> & {
	/** The type of channel */
	type: ChannelType.PrivateThread;
};

/**
 * A voice channel for hosting events with an audience.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-types}
 */
export type GuildStageVoiceChannel = Pick<
	Channel,
	| "id"
	| "guild_id"
	| "position"
	| "permission_overwrites"
	| "name"
	| "nsfw"
	| "bitrate"
	| "user_limit"
	| "rate_limit_per_user"
	| "parent_id"
	| "rtc_region"
	| "video_quality_mode"
	| "permissions"
	| "flags"
> & {
	/** The type of channel */
	type: ChannelType.GuildStageVoice;
};

/**
 * The channel in a hub containing the listed servers.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-types}
 */
export type GuildDirectoryChannel = Pick<
	Channel,
	"id" | "guild_id" | "position" | "permission_overwrites" | "name" | "permissions" | "flags"
> & {
	/** The type of channel */
	type: ChannelType.GuildDirectory;
};

/**
 * A channel that can only contain threads.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-types}
 */
export type GuildForumChannel = Pick<
	Channel,
	| "id"
	| "guild_id"
	| "position"
	| "permission_overwrites"
	| "name"
	| "topic"
	| "nsfw"
	| "last_message_id"
	| "rate_limit_per_user"
	| "parent_id"
	| "last_pin_timestamp"
	| "default_auto_archive_duration"
	| "flags"
	| "available_tags"
	| "default_reaction_emoji"
	| "default_thread_rate_limit_per_user"
	| "default_sort_order"
	| "default_forum_layout"
	| "permissions"
> & {
	/** The type of channel */
	type: ChannelType.GuildForum;
};

/**
 * A channel that can only contain threads, similar to GUILD_FORUM channels.
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-types}
 */
export type GuildMediaChannel = Pick<
	Channel,
	| "id"
	| "guild_id"
	| "position"
	| "permission_overwrites"
	| "name"
	| "topic"
	| "nsfw"
	| "last_message_id"
	| "rate_limit_per_user"
	| "parent_id"
	| "last_pin_timestamp"
	| "default_auto_archive_duration"
	| "flags"
	| "available_tags"
	| "default_reaction_emoji"
	| "default_thread_rate_limit_per_user"
	| "default_sort_order"
	| "permissions"
> & {
	/** The type of channel */
	type: ChannelType.GuildMedia;
};

/** Any thread channel (announcement, public, or private thread). */
export type ThreadChannel = AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel;

/** Any voice-based channel (voice or stage). */
export type VoiceBasedChannel = GuildVoiceChannel | GuildStageVoiceChannel;

/** Any guild channel (excludes DM and Group DM). */
export type GuildChannel =
	| GuildTextChannel
	| GuildVoiceChannel
	| GuildCategoryChannel
	| GuildAnnouncementChannel
	| AnnouncementThreadChannel
	| PublicThreadChannel
	| PrivateThreadChannel
	| GuildStageVoiceChannel
	| GuildDirectoryChannel
	| GuildForumChannel
	| GuildMediaChannel;

/** Discriminated union of all channel types. */
export type AnyChannel =
	| GuildTextChannel
	| DmChannel
	| GuildVoiceChannel
	| GroupDmChannel
	| GuildCategoryChannel
	| GuildAnnouncementChannel
	| AnnouncementThreadChannel
	| PublicThreadChannel
	| PrivateThreadChannel
	| GuildStageVoiceChannel
	| GuildDirectoryChannel
	| GuildForumChannel
	| GuildMediaChannel;

/**
 * Represents a followed announcement channel.
 * @see {@link https://discord.com/developers/docs/resources/channel#followed-channel-object}
 */
export interface FollowedChannel {
	/** Source channel ID */
	channel_id: string;
	/** Created target webhook ID */
	webhook_id: string;
}

/**
 * Parameters for modifying a channel's settings.
 * @see {@link https://discord.com/developers/docs/resources/channel#modify-channel-json-params-guild-channel}
 */
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
	/** The position of the channel in the left-hand listing */
	position?: number | null;
	/** 0-1024 character channel topic (0-4096 for GUILD_FORUM and GUILD_MEDIA channels) */
	topic?: string | null;
	/** Whether the channel is NSFW */
	nsfw?: boolean | null;
	/** Amount of seconds a user has to wait before sending another message (0-21600) */
	rate_limit_per_user?: number | null;
	/** The bitrate (in bits) of the voice or stage channel; min 8000 */
	bitrate?: number | null;
	/** The user limit of the voice or stage channel (0 refers to no limit) */
	user_limit?: number | null;
	/** Channel or category-specific permissions */
	permission_overwrites?: Partial<Overwrite>[] | null;
	/** ID of the new parent category for a channel */
	parent_id?: string | null;
	/** Channel voice region ID, automatic when set to null */
	rtc_region?: string | null;
	/** The camera video quality mode of the voice channel */
	video_quality_mode?: VideoQualityMode | null;
	/** The default duration that clients use for newly created threads, in minutes */
	default_auto_archive_duration?: number | null;
	/** The default sort order type used to order posts in GUILD_FORUM and GUILD_MEDIA channels */
	default_sort_order?: SortOrderType | null;
};

/**
 * Parameters for editing channel permission overwrites for a user or role.
 * @see {@link https://discord.com/developers/docs/resources/channel#edit-channel-permissions-json-params}
 */
export type EditChannelPermissionsParams = Partial<Pick<Overwrite, "allow" | "deny">> & Pick<Overwrite, "type">;

/**
 * Parameters for creating a channel invite.
 * @see {@link https://discord.com/developers/docs/resources/channel#create-channel-invite-json-params}
 */
export interface CreateChannelInviteParams {
	/** Duration of invite in seconds before expiry, or 0 for never (0-604800) */
	max_age?: number;
	/** Max number of uses or 0 for unlimited (0-100) */
	max_uses?: number;
	/** Whether this invite only grants temporary membership */
	temporary?: boolean;
	/** If true, don't try to reuse a similar invite */
	unique?: boolean;
	/** The type of target for this voice channel invite */
	target_type?: number;
	/** The ID of the user whose stream to display for this invite */
	target_user_id?: string;
	/** The ID of the embedded application to open for this invite */
	target_application_id?: string;
}

/**
 * Parameters for following an announcement channel.
 * @see {@link https://discord.com/developers/docs/resources/channel#follow-announcement-channel-json-params}
 */
export interface FollowAnnouncementChannelParams {
	/** ID of the target channel */
	webhook_channel_id: string;
}

/**
 * Parameters for adding a recipient to a group DM.
 * @see {@link https://discord.com/developers/docs/resources/channel#group-dm-add-recipient-json-params}
 */
export interface GroupDmAddRecipientParams {
	/** Access token of a user that has granted your app the `gdm.join` scope */
	access_token: string;
	/** Nickname of the user being added */
	nick: string;
}

/**
 * Parameters for starting a thread from an existing message.
 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-from-message-json-params}
 */
export interface StartThreadFromMessageParams {
	/** 1-100 character channel name */
	name: string;
	/** The thread will stop showing in the channel list after this many minutes of inactivity (60, 1440, 4320, 10080) */
	auto_archive_duration?: number;
	/** Amount of seconds a user has to wait before sending another message (0-21600) */
	rate_limit_per_user?: number | null;
}

/**
 * Parameters for starting a thread without an existing message.
 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-without-message-json-params}
 */
export interface StartThreadWithoutMessageParams {
	/** 1-100 character channel name */
	name: string;
	/** The thread will stop showing in the channel list after this many minutes of inactivity (60, 1440, 4320, 10080) */
	auto_archive_duration?: number;
	/** The type of thread to create */
	type?: ChannelType;
	/** Whether non-moderators can add other non-moderators to the thread; only available when creating a private thread */
	invitable?: boolean;
	/** Amount of seconds a user has to wait before sending another message (0-21600) */
	rate_limit_per_user?: number | null;
}

/**
 * Message parameters for the initial message in a forum or media thread.
 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-in-forum-or-media-channel-forum-and-media-thread-message-params-object}
 */
export interface ForumThreadMessageParams {
	/** Message contents (up to 2000 characters) */
	content?: string;
	/** Up to 10 rich embeds (up to 6000 characters) */
	embeds?: Embed[];
	/** Allowed mentions for the message */
	allowed_mentions?: AllowedMentions;
	/** Components to include with the message */
	components?: unknown[];
	/** IDs of up to 3 stickers in the server to send in the message */
	sticker_ids?: string[];
	/** Attachment objects with filename and description */
	attachments?: Partial<Attachment>[];
	/** Message flags (only SUPPRESS_EMBEDS and SUPPRESS_NOTIFICATIONS can be set) */
	flags?: number;
}

/**
 * Parameters for starting a thread in a forum or media channel.
 * @see {@link https://discord.com/developers/docs/resources/channel#start-thread-in-forum-or-media-channel-json-params}
 */
export interface StartThreadInForumOrMediaChannelParams {
	/** 1-100 character channel name */
	name: string;
	/** The thread will stop showing in the channel list after this many minutes of inactivity (60, 1440, 4320, 10080) */
	auto_archive_duration?: number;
	/** Amount of seconds a user has to wait before sending another message (0-21600) */
	rate_limit_per_user?: number | null;
	/** Contents of the first message in the forum/media thread */
	message: ForumThreadMessageParams;
	/** The IDs of the set of tags that have been applied to a thread; limited to 5 */
	applied_tags?: string[];
}

/**
 * Query parameters for listing thread members.
 * @see {@link https://discord.com/developers/docs/resources/channel#list-thread-members-query-string-params}
 */
export type ListThreadMembersParams = Pick<PaginationParams, "after" | "limit"> & {
	/** Whether to include a guild member object for each thread member */
	with_member?: boolean;
};

/**
 * Query parameters for listing archived threads.
 * @see {@link https://discord.com/developers/docs/resources/channel#list-public-archived-threads-query-string-params}
 */
export type ListArchivedThreadsParams = Pick<PaginationParams, "before" | "limit">;

/**
 * Response from listing archived threads.
 * @see {@link https://discord.com/developers/docs/resources/channel#list-public-archived-threads-response-body}
 */
export interface ListArchivedThreadsResponse {
	/** The archived threads */
	threads: Channel[];
	/** A thread member object for each returned thread the current user has joined */
	members: ThreadMember[];
	/** Whether there are potentially additional threads that could be returned on a subsequent call */
	has_more: boolean;
}
