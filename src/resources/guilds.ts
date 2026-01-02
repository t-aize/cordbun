import type { REST } from "../rest/index.js";
import type { Channel, DefaultReaction, ForumTag, Overwrite, ThreadMember } from "./channels.js";
import type { Emoji } from "./emojis.js";
import type { Invite, InviteMetadata } from "./invites.js";
import type { Role, RoleColors } from "./roles.js";
import type { Sticker } from "./stickers.js";
import type { AvatarDecorationData, User } from "./users.js";
import type { PaginationParams } from "./utils.js";
import type { VoiceRegion } from "./voice.js";

/**
 * Default message notification level for a guild.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level}
 */
export enum DefaultMessageNotificationLevel {
	/** Members will receive notifications for all messages by default */
	AllMessages = 0,
	/** Members will receive notifications only for messages that @mention them by default */
	OnlyMentions = 1,
}

/**
 * Explicit content filter level for a guild.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level}
 */
export enum ExplicitContentFilterLevel {
	/** Media content will not be scanned */
	Disabled = 0,
	/** Media content sent by members without roles will be scanned */
	MembersWithoutRoles = 1,
	/** Media content sent by all members will be scanned */
	AllMembers = 2,
}

/**
 * MFA (Multi-Factor Authentication) level required for moderation actions.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-mfa-level}
 */
export enum MfaLevel {
	/** Guild has no MFA/2FA requirement for moderation actions */
	None = 0,
	/** Guild has a 2FA requirement for moderation actions */
	Elevated = 1,
}

/**
 * Verification level required for members to send messages.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-verification-level}
 */
export enum VerificationLevel {
	/** Unrestricted */
	None = 0,
	/** Must have verified email on account */
	Low = 1,
	/** Must be registered on Discord for longer than 5 minutes */
	Medium = 2,
	/** Must be a member of the server for longer than 10 minutes */
	High = 3,
	/** Must have a verified phone number */
	VeryHigh = 4,
}

/**
 * NSFW level for a guild.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level}
 */
export enum GuildNsfwLevel {
	Default = 0,
	Explicit = 1,
	Safe = 2,
	AgeRestricted = 3,
}

/**
 * Premium tier (Server Boost level) for a guild.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-premium-tier}
 */
export enum PremiumTier {
	/** Guild has not unlocked any Server Boost perks */
	None = 0,
	/** Guild has unlocked Server Boost level 1 perks */
	Tier1 = 1,
	/** Guild has unlocked Server Boost level 2 perks */
	Tier2 = 2,
	/** Guild has unlocked Server Boost level 3 perks */
	Tier3 = 3,
}

/**
 * Flags for the system channel in a guild.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags}
 */
export enum SystemChannelFlags {
	/** Suppress member join notifications */
	SuppressJoinNotifications = 1 << 0,
	/** Suppress server boost notifications */
	SuppressPremiumSubscriptions = 1 << 1,
	/** Suppress server setup tips */
	SuppressGuildReminderNotifications = 1 << 2,
	/** Hide member join sticker reply buttons */
	SuppressJoinNotificationReplies = 1 << 3,
	/** Suppress role subscription purchase and renewal notifications */
	SuppressRoleSubscriptionPurchaseNotifications = 1 << 4,
	/** Hide role subscription sticker reply buttons */
	SuppressRoleSubscriptionPurchaseNotificationReplies = 1 << 5,
}

/**
 * Flags for a guild member.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-flags}
 */
export enum GuildMemberFlags {
	/** Member has left and rejoined the guild */
	DidRejoin = 1 << 0,
	/** Member has completed onboarding */
	CompletedOnboarding = 1 << 1,
	/** Member is exempt from guild verification requirements */
	BypassesVerification = 1 << 2,
	/** Member has started onboarding */
	StartedOnboarding = 1 << 3,
	/** Member is a guest and can only access the voice channel they were invited to */
	IsGuest = 1 << 4,
	/** Member has started Server Guide new member actions */
	StartedHomeActions = 1 << 5,
	/** Member has completed Server Guide new member actions */
	CompletedHomeActions = 1 << 6,
	/** Member's username, display name, or nickname is blocked by AutoMod */
	AutomodQuarantinedUsername = 1 << 7,
	/** Member has dismissed the DM settings upsell */
	DmSettingsUpsellAcknowledged = 1 << 9,
	/** Member's guild tag is blocked by AutoMod */
	AutomodQuarantinedGuildTag = 1 << 10,
}

/**
 * Behavior when an integration subscription expires.
 * @see {@link https://discord.com/developers/docs/resources/guild#integration-object-integration-expire-behaviors}
 */
export enum IntegrationExpireBehavior {
	/** Remove the role from the member */
	RemoveRole = 0,
	/** Kick the member from the guild */
	Kick = 1,
}

/**
 * Mode for guild onboarding.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-onboarding-object-onboarding-mode}
 */
export enum OnboardingMode {
	/** Counts only Default Channels towards constraints */
	OnboardingDefault = 0,
	/** Counts Default Channels and Questions towards constraints */
	OnboardingAdvanced = 1,
}

/**
 * Type of onboarding prompt.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-onboarding-object-prompt-types}
 */
export enum PromptType {
	MultipleChoice = 0,
	Dropdown = 1,
}

/**
 * Style options for the guild widget image.
 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget-image-widget-style-options}
 */
export enum WidgetStyle {
	/** Shield style widget with Discord icon and guild members online count */
	Shield = "shield",
	/** Large image with guild icon, name and online count. "POWERED BY DISCORD" as footer */
	Banner1 = "banner1",
	/** Smaller widget style with guild icon, name and online count. Split with Discord logo */
	Banner2 = "banner2",
	/** Large image with guild icon, name and online count. Discord logo and "Chat Now" in footer */
	Banner3 = "banner3",
	/** Large Discord logo at top, guild info in middle, "JOIN MY SERVER" button at bottom */
	Banner4 = "banner4",
}

/**
 * Represents a Discord guild (server).
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-object}
 */
export interface Guild {
	/** Guild ID */
	id: string;
	/** Guild name (2-100 characters) */
	name: string;
	/** Icon hash */
	icon: string | null;
	/** Icon hash, returned when in the template object */
	icon_hash?: string | null;
	/** Splash hash */
	splash: string | null;
	/** Discovery splash hash; only present for guilds with the "DISCOVERABLE" feature */
	discovery_splash: string | null;
	/** True if the user is the owner of the guild */
	owner?: boolean;
	/** ID of the guild owner */
	owner_id: string;
	/** Total permissions for the user in the guild (excludes overwrites) */
	permissions?: string;
	/** Voice region ID for the guild (deprecated) */
	region?: string | null;
	/** ID of the AFK channel */
	afk_channel_id: string | null;
	/** AFK timeout in seconds */
	afk_timeout: number;
	/** True if the server widget is enabled */
	widget_enabled?: boolean;
	/** The channel ID that the widget will generate an invite to, or null if set to no invite */
	widget_channel_id?: string | null;
	/** Verification level required for the guild */
	verification_level: VerificationLevel;
	/** Default message notifications level */
	default_message_notifications: DefaultMessageNotificationLevel;
	/** Explicit content filter level */
	explicit_content_filter: ExplicitContentFilterLevel;
	/** Roles in the guild */
	roles: Role[];
	/** Custom guild emojis */
	emojis: Emoji[];
	/** Enabled guild features */
	features: string[];
	/** Required MFA level for the guild */
	mfa_level: MfaLevel;
	/** Application ID of the guild creator if it is bot-created */
	application_id: string | null;
	/** The ID of the channel where guild notices are posted */
	system_channel_id: string | null;
	/** System channel flags */
	system_channel_flags: SystemChannelFlags;
	/** The ID of the channel where Community guilds can display rules */
	rules_channel_id: string | null;
	/** The maximum number of presences for the guild */
	max_presences?: number | null;
	/** The maximum number of members for the guild */
	max_members?: number;
	/** The vanity URL code for the guild */
	vanity_url_code: string | null;
	/** The description of the guild */
	description: string | null;
	/** Banner hash */
	banner: string | null;
	/** Premium tier (Server Boost level) */
	premium_tier: PremiumTier;
	/** The number of boosts this guild currently has */
	premium_subscription_count?: number;
	/** The preferred locale of a Community guild */
	preferred_locale: string;
	/** The ID of the channel where admins and moderators receive notices from Discord */
	public_updates_channel_id: string | null;
	/** The maximum amount of users in a video channel */
	max_video_channel_users?: number;
	/** The maximum amount of users in a stage video channel */
	max_stage_video_channel_users?: number;
	/** Approximate number of members in this guild */
	approximate_member_count?: number;
	/** Approximate number of non-offline members in this guild */
	approximate_presence_count?: number;
	/** The welcome screen of a Community guild */
	welcome_screen?: WelcomeScreen;
	/** Guild NSFW level */
	nsfw_level: GuildNsfwLevel;
	/** Custom guild stickers */
	stickers?: Sticker[];
	/** Whether the guild has the boost progress bar enabled */
	premium_progress_bar_enabled: boolean;
	/** The ID of the channel where safety alerts are sent */
	safety_alerts_channel_id: string | null;
	/** The incidents data for this guild */
	incidents_data: IncidentsData | null;
}

/**
 * A partial guild object representing an offline or unavailable guild.
 * @see {@link https://discord.com/developers/docs/resources/guild#unavailable-guild-object}
 */
export interface UnavailableGuild {
	/** Guild ID */
	id: string;
	/** Always true for unavailable guilds */
	unavailable: true;
}

/**
 * A preview of a guild that can be shown before joining.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-preview-object}
 */
export interface GuildPreview {
	/** Guild ID */
	id: string;
	/** Guild name (2-100 characters) */
	name: string;
	/** Icon hash */
	icon: string | null;
	/** Splash hash */
	splash: string | null;
	/** Discovery splash hash */
	discovery_splash: string | null;
	/** Custom guild emojis */
	emojis: Emoji[];
	/** Enabled guild features */
	features: string[];
	/** Approximate number of members in this guild */
	approximate_member_count: number;
	/** Approximate number of online members in this guild */
	approximate_presence_count: number;
	/** The description for the guild */
	description: string | null;
	/** Custom guild stickers */
	stickers: Sticker[];
}

/**
 * Settings for the guild widget.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-widget-settings-object}
 */
export interface GuildWidgetSettings {
	/** Whether the widget is enabled */
	enabled: boolean;
	/** The widget channel ID */
	channel_id: string | null;
}

/**
 * The guild widget object.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-widget-object}
 */
export interface GuildWidget {
	/** Guild ID */
	id: string;
	/** Guild name (2-100 characters) */
	name: string;
	/** Instant invite for the guilds specified widget invite channel */
	instant_invite: string | null;
	/** Voice and stage channels which are accessible by @everyone */
	channels: Partial<Channel>[];
	/** Special widget user objects that includes users presence (Limit 100) */
	members: Partial<User>[];
	/** Number of online members in this guild */
	presence_count: number;
}

/**
 * Represents a member of a guild.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
 */
export interface GuildMember {
	/** The user this guild member represents */
	user?: User;
	/** This user's guild nickname */
	nick?: string | null;
	/** The member's guild avatar hash */
	avatar?: string | null;
	/** The member's guild banner hash */
	banner?: string | null;
	/** Array of role object IDs */
	roles: string[];
	/** When the user joined the guild (null if invited as guest) */
	joined_at: string | null;
	/** When the user started boosting the guild */
	premium_since?: string | null;
	/** Whether the user is deafened in voice channels */
	deaf: boolean;
	/** Whether the user is muted in voice channels */
	mute: boolean;
	/** Guild member flags */
	flags: GuildMemberFlags;
	/** Whether the user has not yet passed the guild's Membership Screening requirements */
	pending?: boolean;
	/** Total permissions of the member in the channel, including overwrites */
	permissions?: string;
	/** When the user's timeout will expire */
	communication_disabled_until?: string | null;
	/** Data for the member's guild avatar decoration */
	avatar_decoration_data?: AvatarDecorationData | null;
}

/**
 * Account information for an integration.
 * @see {@link https://discord.com/developers/docs/resources/guild#integration-account-object}
 */
export interface IntegrationAccount {
	/** ID of the account */
	id: string;
	/** Name of the account */
	name: string;
}

/**
 * Application information for a Discord integration.
 * @see {@link https://discord.com/developers/docs/resources/guild#integration-application-object}
 */
export interface IntegrationApplication {
	/** The ID of the app */
	id: string;
	/** The name of the app */
	name: string;
	/** The icon hash of the app */
	icon: string | null;
	/** The description of the app */
	description: string;
	/** The bot associated with this application */
	bot?: User;
}

/**
 * Represents an integration attached to a guild.
 * @see {@link https://discord.com/developers/docs/resources/guild#integration-object}
 */
export interface Integration {
	/** Integration ID */
	id: string;
	/** Integration name */
	name: string;
	/** Integration type (twitch, youtube, discord, or guild_subscription) */
	type: string;
	/** Is this integration enabled */
	enabled: boolean;
	/** Is this integration syncing */
	syncing?: boolean;
	/** ID that this integration uses for "subscribers" */
	role_id?: string;
	/** Whether emoticons should be synced for this integration (twitch only currently) */
	enable_emoticons?: boolean;
	/** The behavior of expiring subscribers */
	expire_behavior?: IntegrationExpireBehavior;
	/** The grace period (in days) before expiring subscribers */
	expire_grace_period?: number;
	/** User for this integration */
	user?: User;
	/** Integration account information */
	account: IntegrationAccount;
	/** When this integration was last synced */
	synced_at?: string;
	/** How many subscribers this integration has */
	subscriber_count?: number;
	/** Has this integration been revoked */
	revoked?: boolean;
	/** The bot/OAuth2 application for discord integrations */
	application?: IntegrationApplication;
	/** The scopes the application has been authorized for */
	scopes?: string[];
}

/**
 * Represents a ban on a guild.
 * @see {@link https://discord.com/developers/docs/resources/guild#ban-object}
 */
export interface Ban {
	/** The reason for the ban */
	reason: string | null;
	/** The banned user */
	user: User;
}

/**
 * A channel shown in the welcome screen.
 * @see {@link https://discord.com/developers/docs/resources/guild#welcome-screen-object-welcome-screen-channel-structure}
 */
export interface WelcomeScreenChannel {
	/** The channel's ID */
	channel_id: string;
	/** The description shown for the channel */
	description: string;
	/** The emoji ID, if the emoji is custom */
	emoji_id: string | null;
	/** The emoji name if custom, the unicode character if standard, or null if no emoji is set */
	emoji_name: string | null;
}

/**
 * The welcome screen shown to new members in a Community guild.
 * @see {@link https://discord.com/developers/docs/resources/guild#welcome-screen-object}
 */
export interface WelcomeScreen {
	/** The server description shown in the welcome screen */
	description: string | null;
	/** The channels shown in the welcome screen, up to 5 */
	welcome_channels: WelcomeScreenChannel[];
}

/**
 * An option within an onboarding prompt.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-onboarding-object-prompt-option-structure}
 */
export interface OnboardingPromptOption {
	/** ID of the prompt option */
	id: string;
	/** IDs for channels a member is added to when the option is selected */
	channel_ids: string[];
	/** IDs for roles assigned to a member when the option is selected */
	role_ids: string[];
	/** Emoji of the option */
	emoji?: Emoji;
	/** Emoji ID of the option */
	emoji_id?: string;
	/** Emoji name of the option */
	emoji_name?: string;
	/** Whether the emoji is animated */
	emoji_animated?: boolean;
	/** Title of the option */
	title: string;
	/** Description of the option */
	description: string | null;
}

/**
 * A prompt shown during onboarding.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-onboarding-object-onboarding-prompt-structure}
 */
export interface OnboardingPrompt {
	/** ID of the prompt */
	id: string;
	/** Type of prompt */
	type: PromptType;
	/** Options available within the prompt */
	options: OnboardingPromptOption[];
	/** Title of the prompt */
	title: string;
	/** Indicates whether users are limited to selecting one option for the prompt */
	single_select: boolean;
	/** Indicates whether the prompt is required before a user completes the onboarding flow */
	required: boolean;
	/** Indicates whether the prompt is present in the onboarding flow */
	in_onboarding: boolean;
}

/**
 * Guild onboarding configuration.
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-onboarding-object}
 */
export interface GuildOnboarding {
	/** ID of the guild this onboarding is part of */
	guild_id: string;
	/** Prompts shown during onboarding and in customize community */
	prompts: OnboardingPrompt[];
	/** Channel IDs that members get opted into automatically */
	default_channel_ids: string[];
	/** Whether onboarding is enabled in the guild */
	enabled: boolean;
	/** Current mode of onboarding */
	mode: OnboardingMode;
}

/**
 * Data about guild incidents (raids, DM spam, etc.).
 * @see {@link https://discord.com/developers/docs/resources/guild#incidents-data-object}
 */
export interface IncidentsData {
	/** When invites get enabled again */
	invites_disabled_until: string | null;
	/** When direct messages get enabled again */
	dms_disabled_until: string | null;
	/** When the DM spam was detected */
	dm_spam_detected_at?: string | null;
	/** When the raid was detected */
	raid_detected_at?: string | null;
}

// ========== Request/Response Types ==========

/**
 * Query parameters for getting a guild.
 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-query-string-params}
 */
export interface GetGuildParams {
	/** When true, will return approximate member and presence counts for the guild */
	with_counts?: boolean;
	[key: string]: string | number | boolean | undefined;
}

/**
 * Parameters for modifying a guild.
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-json-params}
 */
export type ModifyGuildParams = Partial<
	Pick<
		Guild,
		| "name"
		| "afk_timeout"
		| "icon"
		| "splash"
		| "discovery_splash"
		| "banner"
		| "system_channel_flags"
		| "features"
		| "description"
		| "premium_progress_bar_enabled"
	>
> & {
	/** Voice region ID (deprecated) */
	region?: string | null;
	/** Verification level */
	verification_level?: VerificationLevel | null;
	/** Default message notification level */
	default_message_notifications?: DefaultMessageNotificationLevel | null;
	/** Explicit content filter level */
	explicit_content_filter?: ExplicitContentFilterLevel | null;
	/** ID of the AFK channel */
	afk_channel_id?: string | null;
	/** ID of the system channel */
	system_channel_id?: string | null;
	/** ID of the rules channel */
	rules_channel_id?: string | null;
	/** ID of the public updates channel */
	public_updates_channel_id?: string | null;
	/** Preferred locale of a Community guild */
	preferred_locale?: string | null;
	/** ID of the safety alerts channel */
	safety_alerts_channel_id?: string | null;
};

/**
 * Parameters for creating a guild channel.
 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-channel-json-params}
 */
export interface CreateGuildChannelParams {
	/** Channel name (1-100 characters) */
	name: string;
	/** The type of channel */
	type?: number;
	/** Channel topic (0-1024 characters) */
	topic?: string;
	/** The bitrate (in bits) of the voice or stage channel */
	bitrate?: number;
	/** The user limit of the voice channel */
	user_limit?: number;
	/** Amount of seconds a user has to wait before sending another message */
	rate_limit_per_user?: number;
	/** Sorting position of the channel */
	position?: number;
	/** The channel's permission overwrites */
	permission_overwrites?: Overwrite[];
	/** ID of the parent category for a channel */
	parent_id?: string;
	/** Whether the channel is NSFW */
	nsfw?: boolean;
	/** Channel voice region ID, automatic when set to null */
	rtc_region?: string;
	/** The camera video quality mode of the voice channel */
	video_quality_mode?: number;
	/** The default duration for newly created threads */
	default_auto_archive_duration?: number;
	/** Emoji to show in the add reaction button on a thread */
	default_reaction_emoji?: DefaultReaction;
	/** Set of tags that can be used in a forum or media channel */
	available_tags?: ForumTag[];
	/** The default sort order type */
	default_sort_order?: number;
	/** The default forum layout view */
	default_forum_layout?: number;
	/** The initial rate_limit_per_user for newly created threads */
	default_thread_rate_limit_per_user?: number;
}

/**
 * Parameters for modifying guild channel positions.
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-channel-positions-json-params}
 */
export interface ModifyGuildChannelPositionsParams {
	/** Channel ID */
	id: string;
	/** Sorting position of the channel */
	position?: number | null;
	/** Syncs the permission overwrites with the new parent, if moving to a new category */
	lock_permissions?: boolean | null;
	/** The new parent ID for the channel that is moved */
	parent_id?: string | null;
}

/**
 * Response from listing active guild threads.
 * @see {@link https://discord.com/developers/docs/resources/guild#list-active-guild-threads-response-body}
 */
export interface ListActiveGuildThreadsResponse {
	/** The active threads */
	threads: Channel[];
	/** A thread member object for each returned thread the current user has joined */
	members: ThreadMember[];
}

/**
 * Query parameters for listing guild members.
 * @see {@link https://discord.com/developers/docs/resources/guild#list-guild-members-query-string-params}
 */
export type ListGuildMembersParams = Pick<PaginationParams, "limit" | "after">;

/**
 * Query parameters for searching guild members.
 * @see {@link https://discord.com/developers/docs/resources/guild#search-guild-members-query-string-params}
 */
export interface SearchGuildMembersParams {
	/** Query string to match username(s) and nickname(s) against */
	query: string;
	/** Max number of members to return (1-1000) */
	limit?: number;
}

/**
 * Parameters for adding a guild member via OAuth2.
 * @see {@link https://discord.com/developers/docs/resources/guild#add-guild-member-json-params}
 */
export interface AddGuildMemberParams {
	/** An OAuth2 access token granted with the guilds.join scope */
	access_token: string;
	/** Value to set user's nickname to */
	nick?: string;
	/** Array of role IDs the member is assigned */
	roles?: string[];
	/** Whether the user is muted in voice channels */
	mute?: boolean;
	/** Whether the user is deafened in voice channels */
	deaf?: boolean;
}

/**
 * Parameters for modifying a guild member.
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-member-json-params}
 */
export type ModifyGuildMemberParams = Partial<Pick<GuildMember, "nick" | "roles" | "mute" | "deaf" | "flags">> & {
	/** ID of channel to move user to (if they are connected to voice) */
	channel_id?: string | null;
	/** When the user's timeout will expire */
	communication_disabled_until?: string | null;
};

/**
 * Parameters for modifying the current member.
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-current-member-json-params}
 */
export type ModifyCurrentMemberParams = Partial<Pick<GuildMember, "nick" | "banner" | "avatar">>;

/**
 * Query parameters for getting guild bans.
 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-bans-query-string-params}
 */
export type GetGuildBansParams = PaginationParams;

/**
 * Parameters for creating a guild ban.
 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-ban-json-params}
 */
export interface CreateGuildBanParams {
	/** Number of days to delete messages for (0-7) (deprecated) */
	delete_message_days?: number;
	/** Number of seconds to delete messages for, between 0 and 604800 (7 days) */
	delete_message_seconds?: number;
}

/**
 * Parameters for bulk banning users.
 * @see {@link https://discord.com/developers/docs/resources/guild#bulk-guild-ban-json-params}
 */
export interface BulkGuildBanParams {
	/** List of user IDs to ban (max 200) */
	user_ids: string[];
	/** Number of seconds to delete messages for, between 0 and 604800 (7 days) */
	delete_message_seconds?: number;
}

/**
 * Response from bulk banning users.
 * @see {@link https://discord.com/developers/docs/resources/guild#bulk-guild-ban-bulk-ban-response}
 */
export interface BulkGuildBanResponse {
	/** List of user IDs that were successfully banned */
	banned_users: string[];
	/** List of user IDs that were not banned */
	failed_users: string[];
}

/**
 * Parameters for creating a guild role.
 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-role-json-params}
 */
export interface CreateGuildRoleParams {
	/** Name of the role (max 100 characters) */
	name?: string;
	/** Bitwise value of the enabled/disabled permissions */
	permissions?: string;
	/** RGB color value (deprecated, use colors instead) */
	color?: number;
	/** The role's colors */
	colors?: RoleColors;
	/** Whether the role should be displayed separately in the sidebar */
	hoist?: boolean;
	/** The role's icon image (if the guild has the ROLE_ICONS feature) */
	icon?: string | null;
	/** The role's unicode emoji (if the guild has the ROLE_ICONS feature) */
	unicode_emoji?: string | null;
	/** Whether the role should be mentionable */
	mentionable?: boolean;
}

/**
 * Parameters for modifying guild role positions.
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-role-positions-json-params}
 */
export interface ModifyGuildRolePositionsParams {
	/** Role ID */
	id: string;
	/** Sorting position of the role */
	position?: number | null;
}

/**
 * Parameters for modifying a guild role.
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-role-json-params}
 */
export type ModifyGuildRoleParams = CreateGuildRoleParams;

/**
 * Query parameters for getting guild prune count.
 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-prune-count-query-string-params}
 */
export interface GetGuildPruneCountParams {
	/** Number of days to count prune for (1-30) */
	days?: number;
	/** Role(s) to include (comma-delimited array of snowflakes) */
	include_roles?: string;
}

/**
 * Parameters for beginning a guild prune.
 * @see {@link https://discord.com/developers/docs/resources/guild#begin-guild-prune-json-params}
 */
export interface BeginGuildPruneParams {
	/** Number of days to prune (1-30) */
	days?: number;
	/** Whether pruned is returned, discouraged for large guilds */
	compute_prune_count?: boolean;
	/** Role(s) to include */
	include_roles?: string[];
	/** Reason for the prune (deprecated) */
	reason?: string;
}

/**
 * Response from prune operations.
 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-prune-count}
 */
export interface GuildPruneResult {
	/** Number of members that would be/were removed */
	pruned: number | null;
}

/**
 * Parameters for modifying the guild widget settings.
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-widget-json-params}
 */
export type ModifyGuildWidgetParams = Partial<GuildWidgetSettings>;

/**
 * Response from getting the guild vanity URL.
 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-vanity-url}
 */
export interface GuildVanityUrl {
	/** The vanity URL code */
	code: string | null;
	/** Number of times the vanity URL has been used */
	uses: number;
}

/**
 * Query parameters for getting the guild widget image.
 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget-image-query-string-params}
 */
export interface GetGuildWidgetImageParams {
	/** Style of the widget image returned */
	style?: WidgetStyle;
}

/**
 * Parameters for modifying the guild welcome screen.
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-welcome-screen-json-params}
 */
export type ModifyGuildWelcomeScreenParams = Partial<Pick<WelcomeScreen, "description" | "welcome_channels">> & {
	/** Whether the welcome screen is enabled */
	enabled?: boolean;
};

/**
 * Parameters for modifying guild onboarding.
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-onboarding-json-params}
 */
export type ModifyGuildOnboardingParams = Partial<
	Pick<GuildOnboarding, "prompts" | "default_channel_ids" | "enabled" | "mode">
>;

/**
 * Parameters for modifying guild incident actions.
 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-incident-actions-json-params}
 */
export type ModifyGuildIncidentActionsParams = Partial<
	Pick<IncidentsData, "invites_disabled_until" | "dms_disabled_until">
>;

/**
 * API methods for interacting with Discord guilds.
 * @see {@link https://discord.com/developers/docs/resources/guild}
 */
export class GuildsAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Returns the guild object for the given ID.
	 * @param guildId - The ID of the guild
	 * @param params - Query parameters
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild}
	 */
	async get(guildId: string, params: GetGuildParams = {}): Promise<Guild> {
		return this.rest.get(`/guilds/${guildId}`, { query: params });
	}

	/**
	 * Returns the guild preview object for the given ID.
	 * If the user is not in the guild, then the guild must be discoverable.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-preview}
	 */
	async getPreview(guildId: string): Promise<GuildPreview> {
		return this.rest.get(`/guilds/${guildId}/preview`);
	}

	/**
	 * Modify a guild's settings. Requires the MANAGE_GUILD permission.
	 * @param guildId - The ID of the guild
	 * @param params - The parameters to modify
	 * @param reason - Reason for the modification (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild}
	 */
	async modify(guildId: string, params: ModifyGuildParams, reason?: string): Promise<Guild> {
		return this.rest.patch(`/guilds/${guildId}`, { body: params, reason });
	}

	/**
	 * Delete a guild permanently. User must be owner.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#delete-guild}
	 */
	async delete(guildId: string): Promise<void> {
		return this.rest.delete(`/guilds/${guildId}`);
	}

	/**
	 * Returns a list of guild channel objects. Does not include threads.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-channels}
	 */
	async getChannels(guildId: string): Promise<Channel[]> {
		return this.rest.get(`/guilds/${guildId}/channels`);
	}

	/**
	 * Create a new channel object for the guild. Requires the MANAGE_CHANNELS permission.
	 * @param guildId - The ID of the guild
	 * @param params - The channel parameters
	 * @param reason - Reason for the creation (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-channel}
	 */
	async createChannel(guildId: string, params: CreateGuildChannelParams, reason?: string): Promise<Channel> {
		return this.rest.post(`/guilds/${guildId}/channels`, { body: params, reason });
	}

	/**
	 * Modify the positions of a set of channel objects for the guild.
	 * Requires MANAGE_CHANNELS permission.
	 * @param guildId - The ID of the guild
	 * @param params - Array of channel position modifications
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-channel-positions}
	 */
	async modifyChannelPositions(guildId: string, params: ModifyGuildChannelPositionsParams[]): Promise<void> {
		return this.rest.patch(`/guilds/${guildId}/channels`, { body: params });
	}

	/**
	 * Returns all active threads in the guild, including public and private threads.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#list-active-guild-threads}
	 */
	async listActiveThreads(guildId: string): Promise<ListActiveGuildThreadsResponse> {
		return this.rest.get(`/guilds/${guildId}/threads/active`);
	}

	/**
	 * Returns a guild member object for the specified user.
	 * @param guildId - The ID of the guild
	 * @param userId - The ID of the user
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-member}
	 */
	async getMember(guildId: string, userId: string): Promise<GuildMember> {
		return this.rest.get(`/guilds/${guildId}/members/${userId}`);
	}

	/**
	 * Returns a list of guild member objects that are members of the guild.
	 * @param guildId - The ID of the guild
	 * @param params - Query parameters
	 * @see {@link https://discord.com/developers/docs/resources/guild#list-guild-members}
	 */
	async listMembers(guildId: string, params: ListGuildMembersParams = {}): Promise<GuildMember[]> {
		return this.rest.get(`/guilds/${guildId}/members`, { query: params });
	}

	/**
	 * Returns a list of guild member objects whose username or nickname starts with a provided string.
	 * @param guildId - The ID of the guild
	 * @param params - Query parameters
	 * @see {@link https://discord.com/developers/docs/resources/guild#search-guild-members}
	 */
	async searchMembers(guildId: string, params: SearchGuildMembersParams): Promise<GuildMember[]> {
		return this.rest.get(`/guilds/${guildId}/members/search`, { query: params });
	}

	/**
	 * Adds a user to the guild, provided you have a valid OAuth2 access token.
	 * @param guildId - The ID of the guild
	 * @param userId - The ID of the user
	 * @param params - The member parameters
	 * @see {@link https://discord.com/developers/docs/resources/guild#add-guild-member}
	 */
	async addMember(guildId: string, userId: string, params: AddGuildMemberParams): Promise<GuildMember | null> {
		return this.rest.put(`/guilds/${guildId}/members/${userId}`, { body: params });
	}

	/**
	 * Modify attributes of a guild member.
	 * @param guildId - The ID of the guild
	 * @param userId - The ID of the user
	 * @param params - The parameters to modify
	 * @param reason - Reason for the modification (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-member}
	 */
	async modifyMember(
		guildId: string,
		userId: string,
		params: ModifyGuildMemberParams,
		reason?: string,
	): Promise<GuildMember> {
		return this.rest.patch(`/guilds/${guildId}/members/${userId}`, { body: params, reason });
	}

	/**
	 * Modifies the current member in a guild.
	 * @param guildId - The ID of the guild
	 * @param params - The parameters to modify
	 * @param reason - Reason for the modification (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-current-member}
	 */
	async modifyCurrentMember(
		guildId: string,
		params: ModifyCurrentMemberParams,
		reason?: string,
	): Promise<GuildMember> {
		return this.rest.patch(`/guilds/${guildId}/members/@me`, { body: params, reason });
	}

	/**
	 * Adds a role to a guild member. Requires the MANAGE_ROLES permission.
	 * @param guildId - The ID of the guild
	 * @param userId - The ID of the user
	 * @param roleId - The ID of the role
	 * @param reason - Reason for the action (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#add-guild-member-role}
	 */
	async addMemberRole(guildId: string, userId: string, roleId: string, reason?: string): Promise<void> {
		return this.rest.put(`/guilds/${guildId}/members/${userId}/roles/${roleId}`, { reason });
	}

	/**
	 * Removes a role from a guild member. Requires the MANAGE_ROLES permission.
	 * @param guildId - The ID of the guild
	 * @param userId - The ID of the user
	 * @param roleId - The ID of the role
	 * @param reason - Reason for the action (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#remove-guild-member-role}
	 */
	async removeMemberRole(guildId: string, userId: string, roleId: string, reason?: string): Promise<void> {
		return this.rest.delete(`/guilds/${guildId}/members/${userId}/roles/${roleId}`, { reason });
	}

	/**
	 * Remove a member from a guild. Requires KICK_MEMBERS permission.
	 * @param guildId - The ID of the guild
	 * @param userId - The ID of the user
	 * @param reason - Reason for the kick (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#remove-guild-member}
	 */
	async removeMember(guildId: string, userId: string, reason?: string): Promise<void> {
		return this.rest.delete(`/guilds/${guildId}/members/${userId}`, { reason });
	}

	/**
	 * Returns a list of ban objects for the users banned from this guild.
	 * Requires the BAN_MEMBERS permission.
	 * @param guildId - The ID of the guild
	 * @param params - Query parameters
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-bans}
	 */
	async getBans(guildId: string, params: GetGuildBansParams = {}): Promise<Ban[]> {
		return this.rest.get(`/guilds/${guildId}/bans`, { query: params });
	}

	/**
	 * Returns a ban object for the given user.
	 * Requires the BAN_MEMBERS permission.
	 * @param guildId - The ID of the guild
	 * @param userId - The ID of the user
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-ban}
	 */
	async getBan(guildId: string, userId: string): Promise<Ban> {
		return this.rest.get(`/guilds/${guildId}/bans/${userId}`);
	}

	/**
	 * Create a guild ban, and optionally delete previous messages sent by the banned user.
	 * Requires the BAN_MEMBERS permission.
	 * @param guildId - The ID of the guild
	 * @param userId - The ID of the user
	 * @param params - The ban parameters
	 * @param reason - Reason for the ban (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-ban}
	 */
	async createBan(
		guildId: string,
		userId: string,
		params: CreateGuildBanParams = {},
		reason?: string,
	): Promise<void> {
		return this.rest.put(`/guilds/${guildId}/bans/${userId}`, { body: params, reason });
	}

	/**
	 * Remove the ban for a user. Requires the BAN_MEMBERS permission.
	 * @param guildId - The ID of the guild
	 * @param userId - The ID of the user
	 * @param reason - Reason for the unban (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#remove-guild-ban}
	 */
	async removeBan(guildId: string, userId: string, reason?: string): Promise<void> {
		return this.rest.delete(`/guilds/${guildId}/bans/${userId}`, { reason });
	}

	/**
	 * Ban up to 200 users from a guild.
	 * Requires both the BAN_MEMBERS and MANAGE_GUILD permissions.
	 * @param guildId - The ID of the guild
	 * @param params - The bulk ban parameters
	 * @param reason - Reason for the bans (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#bulk-guild-ban}
	 */
	async bulkBan(guildId: string, params: BulkGuildBanParams, reason?: string): Promise<BulkGuildBanResponse> {
		return this.rest.post(`/guilds/${guildId}/bulk-ban`, { body: params, reason });
	}

	/**
	 * Returns a list of role objects for the guild.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-roles}
	 */
	async getRoles(guildId: string): Promise<Role[]> {
		return this.rest.get(`/guilds/${guildId}/roles`);
	}

	/**
	 * Returns a role object for the specified role.
	 * @param guildId - The ID of the guild
	 * @param roleId - The ID of the role
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-role}
	 */
	async getRole(guildId: string, roleId: string): Promise<Role> {
		return this.rest.get(`/guilds/${guildId}/roles/${roleId}`);
	}

	/**
	 * Returns a map of role IDs to the number of members with the role.
	 * Does not include the @everyone role.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-role-member-counts}
	 */
	async getRoleMemberCounts(guildId: string): Promise<Record<string, number>> {
		return this.rest.get(`/guilds/${guildId}/roles/member-counts`);
	}

	/**
	 * Create a new role for the guild. Requires the MANAGE_ROLES permission.
	 * @param guildId - The ID of the guild
	 * @param params - The role parameters
	 * @param reason - Reason for the creation (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#create-guild-role}
	 */
	async createRole(guildId: string, params: CreateGuildRoleParams = {}, reason?: string): Promise<Role> {
		return this.rest.post(`/guilds/${guildId}/roles`, { body: params, reason });
	}

	/**
	 * Modify the positions of a set of role objects for the guild.
	 * Requires the MANAGE_ROLES permission.
	 * @param guildId - The ID of the guild
	 * @param params - Array of role position modifications
	 * @param reason - Reason for the modification (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-role-positions}
	 */
	async modifyRolePositions(
		guildId: string,
		params: ModifyGuildRolePositionsParams[],
		reason?: string,
	): Promise<Role[]> {
		return this.rest.patch(`/guilds/${guildId}/roles`, { body: params, reason });
	}

	/**
	 * Modify a guild role. Requires the MANAGE_ROLES permission.
	 * @param guildId - The ID of the guild
	 * @param roleId - The ID of the role
	 * @param params - The parameters to modify
	 * @param reason - Reason for the modification (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-role}
	 */
	async modifyRole(guildId: string, roleId: string, params: ModifyGuildRoleParams, reason?: string): Promise<Role> {
		return this.rest.patch(`/guilds/${guildId}/roles/${roleId}`, { body: params, reason });
	}

	/**
	 * Delete a guild role. Requires the MANAGE_ROLES permission.
	 * @param guildId - The ID of the guild
	 * @param roleId - The ID of the role
	 * @param reason - Reason for the deletion (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#delete-guild-role}
	 */
	async deleteRole(guildId: string, roleId: string, reason?: string): Promise<void> {
		return this.rest.delete(`/guilds/${guildId}/roles/${roleId}`, { reason });
	}

	/**
	 * Returns an object with one pruned key indicating the number of members
	 * that would be removed in a prune operation.
	 * Requires the MANAGE_GUILD and KICK_MEMBERS permissions.
	 * @param guildId - The ID of the guild
	 * @param params - Query parameters
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-prune-count}
	 */
	async getPruneCount(guildId: string, params: GetGuildPruneCountParams = {}): Promise<GuildPruneResult> {
		return this.rest.get(`/guilds/${guildId}/prune`, { query: params });
	}

	/**
	 * Begin a prune operation.
	 * Requires the MANAGE_GUILD and KICK_MEMBERS permissions.
	 * @param guildId - The ID of the guild
	 * @param params - The prune parameters
	 * @param reason - Reason for the prune (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#begin-guild-prune}
	 */
	async beginPrune(guildId: string, params: BeginGuildPruneParams = {}, reason?: string): Promise<GuildPruneResult> {
		return this.rest.post(`/guilds/${guildId}/prune`, { body: params, reason });
	}

	/**
	 * Returns a list of voice region objects for the guild.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-voice-regions}
	 */
	async getVoiceRegions(guildId: string): Promise<VoiceRegion[]> {
		return this.rest.get(`/guilds/${guildId}/regions`);
	}

	/**
	 * Returns a list of invite objects for the guild.
	 * Requires the MANAGE_GUILD or VIEW_AUDIT_LOG permission.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-invites}
	 */
	async getInvites(guildId: string): Promise<(Invite & InviteMetadata)[]> {
		return this.rest.get(`/guilds/${guildId}/invites`);
	}

	/**
	 * Returns a list of integration objects for the guild.
	 * Requires the MANAGE_GUILD permission.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-integrations}
	 */
	async getIntegrations(guildId: string): Promise<Integration[]> {
		return this.rest.get(`/guilds/${guildId}/integrations`);
	}

	/**
	 * Delete the attached integration object for the guild.
	 * Requires the MANAGE_GUILD permission.
	 * @param guildId - The ID of the guild
	 * @param integrationId - The ID of the integration
	 * @param reason - Reason for the deletion (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#delete-guild-integration}
	 */
	async deleteIntegration(guildId: string, integrationId: string, reason?: string): Promise<void> {
		return this.rest.delete(`/guilds/${guildId}/integrations/${integrationId}`, { reason });
	}

	/**
	 * Returns a guild widget settings object.
	 * Requires the MANAGE_GUILD permission.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget-settings}
	 */
	async getWidgetSettings(guildId: string): Promise<GuildWidgetSettings> {
		return this.rest.get(`/guilds/${guildId}/widget`);
	}

	/**
	 * Modify a guild widget settings object for the guild.
	 * Requires the MANAGE_GUILD permission.
	 * @param guildId - The ID of the guild
	 * @param params - The widget settings to modify
	 * @param reason - Reason for the modification (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-widget}
	 */
	async modifyWidgetSettings(
		guildId: string,
		params: ModifyGuildWidgetParams,
		reason?: string,
	): Promise<GuildWidgetSettings> {
		return this.rest.patch(`/guilds/${guildId}/widget`, { body: params, reason });
	}

	/**
	 * Returns the widget for the guild.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget}
	 */
	async getWidget(guildId: string): Promise<GuildWidget> {
		return this.rest.get(`/guilds/${guildId}/widget.json`);
	}

	/**
	 * Returns a partial invite object for guilds with that feature enabled.
	 * Requires the MANAGE_GUILD permission.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-vanity-url}
	 */
	async getVanityUrl(guildId: string): Promise<GuildVanityUrl> {
		return this.rest.get(`/guilds/${guildId}/vanity-url`);
	}

	/**
	 * Returns a PNG image widget for the guild. Requires no permissions or authentication.
	 * @param guildId - The ID of the guild
	 * @param params - Query parameters
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-widget-image}
	 */
	getWidgetImageUrl(guildId: string, params: GetGuildWidgetImageParams = {}): string {
		const url = new URL(`https://discord.com/api/guilds/${guildId}/widget.png`);
		if (params.style) {
			url.searchParams.set("style", params.style);
		}
		return url.toString();
	}

	/**
	 * Returns the Welcome Screen object for the guild.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-welcome-screen}
	 */
	async getWelcomeScreen(guildId: string): Promise<WelcomeScreen> {
		return this.rest.get(`/guilds/${guildId}/welcome-screen`);
	}

	/**
	 * Modify the guild's Welcome Screen.
	 * Requires the MANAGE_GUILD permission.
	 * @param guildId - The ID of the guild
	 * @param params - The parameters to modify
	 * @param reason - Reason for the modification (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-welcome-screen}
	 */
	async modifyWelcomeScreen(
		guildId: string,
		params: ModifyGuildWelcomeScreenParams,
		reason?: string,
	): Promise<WelcomeScreen> {
		return this.rest.patch(`/guilds/${guildId}/welcome-screen`, { body: params, reason });
	}

	/**
	 * Returns the Onboarding object for the guild.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/guild#get-guild-onboarding}
	 */
	async getOnboarding(guildId: string): Promise<GuildOnboarding> {
		return this.rest.get(`/guilds/${guildId}/onboarding`);
	}

	/**
	 * Modifies the onboarding configuration of the guild.
	 * Requires the MANAGE_GUILD and MANAGE_ROLES permissions.
	 * @param guildId - The ID of the guild
	 * @param params - The parameters to modify
	 * @param reason - Reason for the modification (audit log)
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-onboarding}
	 */
	async modifyOnboarding(
		guildId: string,
		params: ModifyGuildOnboardingParams,
		reason?: string,
	): Promise<GuildOnboarding> {
		return this.rest.put(`/guilds/${guildId}/onboarding`, { body: params, reason });
	}

	/**
	 * Modifies the incident actions of the guild.
	 * Requires the MANAGE_GUILD permission.
	 * @param guildId - The ID of the guild
	 * @param params - The parameters to modify
	 * @see {@link https://discord.com/developers/docs/resources/guild#modify-guild-incident-actions}
	 */
	async modifyIncidentActions(guildId: string, params: ModifyGuildIncidentActionsParams): Promise<IncidentsData> {
		return this.rest.put(`/guilds/${guildId}/incident-actions`, { body: params });
	}
}
