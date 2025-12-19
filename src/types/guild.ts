import type {
	Channel,
	DefaultReaction,
	ForumTag,
	Overwrite,
	ThreadMember,
} from "./channel.js";
import type { Emoji } from "./emoji.js";
import type { Role, RoleColors } from "./role.js";
import type { Sticker } from "./sticker.js";
import type { AvatarDecorationData, User } from "./user.js";

export enum DefaultMessageNotificationLevel {
	AllMessages = 0,
	OnlyMentions = 1,
}

export enum ExplicitContentFilterLevel {
	Disabled = 0,
	MembersWithoutRoles = 1,
	AllMembers = 2,
}

export enum MfaLevel {
	None = 0,
	Elevated = 1,
}

export enum VerificationLevel {
	None = 0,
	Low = 1,
	Medium = 2,
	High = 3,
	VeryHigh = 4,
}

export enum GuildNsfwLevel {
	Default = 0,
	Explicit = 1,
	Safe = 2,
	AgeRestricted = 3,
}

export enum PremiumTier {
	None = 0,
	Tier1 = 1,
	Tier2 = 2,
	Tier3 = 3,
}

export enum SystemChannelFlags {
	SuppressJoinNotifications = 1 << 0,
	SuppressPremiumSubscriptions = 1 << 1,
	SuppressGuildReminderNotifications = 1 << 2,
	SuppressJoinNotificationReplies = 1 << 3,
	SuppressRoleSubscriptionPurchaseNotifications = 1 << 4,
	SuppressRoleSubscriptionPurchaseNotificationReplies = 1 << 5,
}

export enum GuildMemberFlags {
	DidRejoin = 1 << 0,
	CompletedOnboarding = 1 << 1,
	BypassesVerification = 1 << 2,
	StartedOnboarding = 1 << 3,
	IsGuest = 1 << 4,
	StartedHomeActions = 1 << 5,
	CompletedHomeActions = 1 << 6,
	AutomodQuarantinedUsername = 1 << 7,
	DmSettingsUpsellAcknowledged = 1 << 9,
	AutomodQuarantinedGuildTag = 1 << 10,
}

export enum IntegrationExpireBehavior {
	RemoveRole = 0,
	Kick = 1,
}

export enum OnboardingMode {
	OnboardingDefault = 0,
	OnboardingAdvanced = 1,
}

export enum PromptType {
	MultipleChoice = 0,
	Dropdown = 1,
}

export interface Guild {
	id: string;
	name: string;
	icon: string | null;
	icon_hash?: string | null;
	splash: string | null;
	discovery_splash: string | null;
	owner?: boolean;
	owner_id: string;
	permissions?: string;
	region?: string | null;
	afk_channel_id: string | null;
	afk_timeout: number;
	widget_enabled?: boolean;
	widget_channel_id?: string | null;
	verification_level: VerificationLevel;
	default_message_notifications: DefaultMessageNotificationLevel;
	explicit_content_filter: ExplicitContentFilterLevel;
	roles: Role[];
	emojis: Emoji[];
	features: string[];
	mfa_level: MfaLevel;
	application_id: string | null;
	system_channel_id: string | null;
	system_channel_flags: SystemChannelFlags;
	rules_channel_id: string | null;
	max_presences?: number | null;
	max_members?: number;
	vanity_url_code: string | null;
	description: string | null;
	banner: string | null;
	premium_tier: PremiumTier;
	premium_subscription_count?: number;
	preferred_locale: string;
	public_updates_channel_id: string | null;
	max_video_channel_users?: number;
	max_stage_video_channel_users?: number;
	approximate_member_count?: number;
	approximate_presence_count?: number;
	welcome_screen?: WelcomeScreen;
	nsfw_level: GuildNsfwLevel;
	stickers?: Sticker[];
	premium_progress_bar_enabled: boolean;
	safety_alerts_channel_id: string | null;
	incidents_data: IncidentsData | null;
}

export interface UnavailableGuild {
	id: string;
	unavailable: true;
}

export interface GuildPreview {
	id: string;
	name: string;
	icon: string | null;
	splash: string | null;
	discovery_splash: string | null;
	emojis: Emoji[];
	features: string[];
	approximate_member_count: number;
	approximate_presence_count: number;
	description: string | null;
	stickers: Sticker[];
}

export interface GuildWidgetSettings {
	enabled: boolean;
	channel_id: string | null;
}

export interface GuildWidget {
	id: string;
	name: string;
	instant_invite: string | null;
	channels: Partial<Channel>[];
	members: Partial<User>[];
	presence_count: number;
}

export interface GuildMember {
	user?: User;
	nick?: string | null;
	avatar?: string | null;
	banner?: string | null;
	roles: string[];
	joined_at: string | null;
	premium_since?: string | null;
	deaf: boolean;
	mute: boolean;
	flags: GuildMemberFlags;
	pending?: boolean;
	permissions?: string;
	communication_disabled_until?: string | null;
	avatar_decoration_data?: AvatarDecorationData | null;
}

export interface IntegrationAccount {
	id: string;
	name: string;
}

export interface IntegrationApplication {
	id: string;
	name: string;
	icon: string | null;
	description: string;
	bot?: User;
}

export interface Integration {
	id: string;
	name: string;
	type: string;
	enabled: boolean;
	syncing?: boolean;
	role_id?: string;
	enable_emoticons?: boolean;
	expire_behavior?: IntegrationExpireBehavior;
	expire_grace_period?: number;
	user?: User;
	account: IntegrationAccount;
	synced_at?: string;
	subscriber_count?: number;
	revoked?: boolean;
	application?: IntegrationApplication;
	scopes?: string[];
}

export interface Ban {
	reason: string | null;
	user: User;
}

export interface WelcomeScreenChannel {
	channel_id: string;
	description: string;
	emoji_id: string | null;
	emoji_name: string | null;
}

export interface WelcomeScreen {
	description: string | null;
	welcome_channels: WelcomeScreenChannel[];
}

export interface OnboardingPromptOption {
	id: string;
	channel_ids: string[];
	role_ids: string[];
	emoji?: Emoji;
	emoji_id?: string;
	emoji_name?: string;
	emoji_animated?: boolean;
	title: string;
	description: string | null;
}

export interface OnboardingPrompt {
	id: string;
	type: PromptType;
	options: OnboardingPromptOption[];
	title: string;
	single_select: boolean;
	required: boolean;
	in_onboarding: boolean;
}

export interface GuildOnboarding {
	guild_id: string;
	prompts: OnboardingPrompt[];
	default_channel_ids: string[];
	enabled: boolean;
	mode: OnboardingMode;
}

export interface IncidentsData {
	invites_disabled_until: string | null;
	dms_disabled_until: string | null;
	dm_spam_detected_at?: string | null;
	raid_detected_at?: string | null;
}

export interface ModifyGuildParams {
	name?: string;
	region?: string | null;
	verification_level?: VerificationLevel | null;
	default_message_notifications?: DefaultMessageNotificationLevel | null;
	explicit_content_filter?: ExplicitContentFilterLevel | null;
	afk_channel_id?: string | null;
	afk_timeout?: number;
	icon?: string | null;
	splash?: string | null;
	discovery_splash?: string | null;
	banner?: string | null;
	system_channel_id?: string | null;
	system_channel_flags?: SystemChannelFlags;
	rules_channel_id?: string | null;
	public_updates_channel_id?: string | null;
	preferred_locale?: string | null;
	features?: string[];
	description?: string | null;
	premium_progress_bar_enabled?: boolean;
	safety_alerts_channel_id?: string | null;
}

export interface CreateGuildChannelParams {
	name: string;
	type?: number;
	topic?: string;
	bitrate?: number;
	user_limit?: number;
	rate_limit_per_user?: number;
	position?: number;
	permission_overwrites?: Overwrite[];
	parent_id?: string;
	nsfw?: boolean;
	rtc_region?: string;
	video_quality_mode?: number;
	default_auto_archive_duration?: number;
	default_reaction_emoji?: DefaultReaction;
	available_tags?: ForumTag[];
	default_sort_order?: number;
	default_forum_layout?: number;
	default_thread_rate_limit_per_user?: number;
}

export interface ModifyGuildChannelPositionsParams {
	id: string;
	position?: number | null;
	lock_permissions?: boolean | null;
	parent_id?: string | null;
}

export interface ListActiveGuildThreadsResponse {
	threads: Channel[];
	members: ThreadMember[];
}

export interface ListGuildMembersParams {
	limit?: number;
	after?: string;
}

export interface SearchGuildMembersParams {
	query: string;
	limit?: number;
}

export interface AddGuildMemberParams {
	access_token: string;
	nick?: string;
	roles?: string[];
	mute?: boolean;
	deaf?: boolean;
}

export interface ModifyGuildMemberParams {
	nick?: string;
	roles?: string[];
	mute?: boolean;
	deaf?: boolean;
	channel_id?: string;
	communication_disabled_until?: string | null;
	flags?: GuildMemberFlags;
}

export interface ModifyCurrentMemberParams {
	nick?: string | null;
	banner?: string | null;
	avatar?: string | null;
	bio?: string | null;
}

export interface GetGuildBansParams {
	limit?: number;
	before?: string;
	after?: string;
}

export interface CreateGuildBanParams {
	delete_message_days?: number;
	delete_message_seconds?: number;
}

export interface BulkGuildBanParams {
	user_ids: string[];
	delete_message_seconds?: number;
}

export interface BulkGuildBanResponse {
	banned_users: string[];
	failed_users: string[];
}

export interface CreateGuildRoleParams {
	name?: string;
	permissions?: string;
	color?: number;
	colors?: RoleColors;
	hoist?: boolean;
	icon?: string | null;
	unicode_emoji?: string | null;
	mentionable?: boolean;
}

export interface ModifyGuildRolePositionsParams {
	id: string;
	position?: number | null;
}

export interface ModifyGuildRoleParams {
	name?: string;
	permissions?: string;
	color?: number;
	colors?: RoleColors;
	hoist?: boolean;
	icon?: string;
	unicode_emoji?: string;
	mentionable?: boolean;
}

export interface GetGuildPruneCountParams {
	days?: number;
	include_roles?: string;
}

export interface BeginGuildPruneParams {
	days?: number;
	compute_prune_count?: boolean;
	include_roles?: string[];
	reason?: string;
}

export interface ModifyGuildWelcomeScreenParams {
	enabled?: boolean;
	welcome_channels?: WelcomeScreenChannel[];
	description?: string;
}

export interface ModifyGuildOnboardingParams {
	prompts?: OnboardingPrompt[];
	default_channel_ids?: string[];
	enabled?: boolean;
	mode?: OnboardingMode;
}

export interface ModifyGuildIncidentActionsParams {
	invites_disabled_until?: string | null;
	dms_disabled_until?: string | null;
}
