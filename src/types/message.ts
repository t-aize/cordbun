import type { Application } from "./application.js";
import type { Channel } from "./channel.js";
import type { Emoji } from "./emoji.js";
import type { Poll } from "./poll.js";
import type { Sticker, StickerItem } from "./sticker.js";
import type { User } from "./user.js";

export enum MessageType {
	Default = 0,
	RecipientAdd = 1,
	RecipientRemove = 2,
	Call = 3,
	ChannelNameChange = 4,
	ChannelIconChange = 5,
	ChannelPinnedMessage = 6,
	UserJoin = 7,
	GuildBoost = 8,
	GuildBoostTier1 = 9,
	GuildBoostTier2 = 10,
	GuildBoostTier3 = 11,
	ChannelFollowAdd = 12,
	GuildDiscoveryDisqualified = 14,
	GuildDiscoveryRequalified = 15,
	GuildDiscoveryGracePeriodInitialWarning = 16,
	GuildDiscoveryGracePeriodFinalWarning = 17,
	ThreadCreated = 18,
	Reply = 19,
	ChatInputCommand = 20,
	ThreadStarterMessage = 21,
	GuildInviteReminder = 22,
	ContextMenuCommand = 23,
	AutoModerationAction = 24,
	RoleSubscriptionPurchase = 25,
	InteractionPremiumUpsell = 26,
	StageStart = 27,
	StageEnd = 28,
	StageSpeaker = 29,
	StageTopic = 31,
	GuildApplicationPremiumSubscription = 32,
	GuildIncidentAlertModeEnabled = 36,
	GuildIncidentAlertModeDisabled = 37,
	GuildIncidentReportRaid = 38,
	GuildIncidentReportFalseAlarm = 39,
	PurchaseNotification = 44,
	PollResult = 46,
}

export enum MessageActivityType {
	Join = 1,
	Spectate = 2,
	Listen = 3,
	JoinRequest = 5,
}

export enum MessageFlags {
	Crossposted = 1 << 0,
	IsCrosspost = 1 << 1,
	SuppressEmbeds = 1 << 2,
	SourceMessageDeleted = 1 << 3,
	Urgent = 1 << 4,
	HasThread = 1 << 5,
	Ephemeral = 1 << 6,
	Loading = 1 << 7,
	FailedToMentionSomeRolesInThread = 1 << 8,
	SuppressNotifications = 1 << 12,
	IsVoiceMessage = 1 << 13,
	HasSnapshot = 1 << 14,
	IsComponentsV2 = 1 << 15,
}

export enum MessageReferenceType {
	Default = 0,
	Forward = 1,
}

export enum AttachmentFlags {
	IsRemix = 1 << 2,
}

export enum AllowedMentionType {
	Roles = "roles",
	Users = "users",
	Everyone = "everyone",
}

export enum ReactionType {
	Normal = 0,
	Burst = 1,
}

export interface MessageActivity {
	type: MessageActivityType;
	party_id?: string;
}

export interface MessageReference {
	type?: MessageReferenceType;
	message_id?: string;
	channel_id?: string;
	guild_id?: string;
	fail_if_not_exists?: boolean;
}

export interface MessageSnapshot {
	message: Partial<Message>;
}

export interface ReactionCountDetails {
	burst: number;
	normal: number;
}

export interface Reaction {
	count: number;
	count_details: ReactionCountDetails;
	me: boolean;
	me_burst: boolean;
	emoji: Partial<Emoji>;
	burst_colors: string[];
}

export interface EmbedThumbnail {
	url: string;
	proxy_url?: string;
	height?: number;
	width?: number;
}

export interface EmbedVideo {
	url?: string;
	proxy_url?: string;
	height?: number;
	width?: number;
}

export interface EmbedImage {
	url: string;
	proxy_url?: string;
	height?: number;
	width?: number;
}

export interface EmbedProvider {
	name?: string;
	url?: string;
}

export interface EmbedAuthor {
	name: string;
	url?: string;
	icon_url?: string;
	proxy_icon_url?: string;
}

export interface EmbedFooter {
	text: string;
	icon_url?: string;
	proxy_icon_url?: string;
}

export interface EmbedField {
	name: string;
	value: string;
	inline?: boolean;
}

export interface Embed {
	title?: string;
	type?: string;
	description?: string;
	url?: string;
	timestamp?: string;
	color?: number;
	footer?: EmbedFooter;
	image?: EmbedImage;
	thumbnail?: EmbedThumbnail;
	video?: EmbedVideo;
	provider?: EmbedProvider;
	author?: EmbedAuthor;
	fields?: EmbedField[];
}

export interface Attachment {
	id: string;
	filename: string;
	title?: string;
	description?: string;
	content_type?: string;
	size: number;
	url: string;
	proxy_url: string;
	height?: number | null;
	width?: number | null;
	ephemeral?: boolean;
	duration_secs?: number;
	waveform?: string;
	flags?: AttachmentFlags;
}

export interface ChannelMention {
	id: string;
	guild_id: string;
	type: number;
	name: string;
}

export interface AllowedMentions {
	parse?: AllowedMentionType[];
	roles?: string[];
	users?: string[];
	replied_user?: boolean;
}

export interface RoleSubscriptionData {
	role_subscription_listing_id: string;
	tier_name: string;
	total_months_subscribed: number;
	is_renewal: boolean;
}

export interface MessageCall {
	participants: string[];
	ended_timestamp?: string | null;
}

export interface MessageInteractionMetadata {
	id: string;
	type: number;
	user: User;
	authorizing_integration_owners: Record<string, string>;
	original_response_message_id?: string;
	target_user?: User;
	target_message_id?: string;
	interacted_message_id?: string;
	triggering_interaction_metadata?: MessageInteractionMetadata;
}

export interface Message {
	id: string;
	channel_id: string;
	author: User;
	content: string;
	timestamp: string;
	edited_timestamp: string | null;
	tts: boolean;
	mention_everyone: boolean;
	mentions: User[];
	mention_roles: string[];
	mention_channels?: ChannelMention[];
	attachments: Attachment[];
	embeds: Embed[];
	reactions?: Reaction[];
	nonce?: number | string;
	pinned: boolean;
	webhook_id?: string;
	type: MessageType;
	activity?: MessageActivity;
	application?: Partial<Application>;
	application_id?: string;
	flags?: MessageFlags;
	message_reference?: MessageReference;
	message_snapshots?: MessageSnapshot[];
	referenced_message?: Message | null;
	interaction_metadata?: MessageInteractionMetadata;
	interaction?: unknown;
	thread?: Channel;
	components?: unknown[];
	sticker_items?: StickerItem[];
	stickers?: Sticker[];
	position?: number;
	role_subscription_data?: RoleSubscriptionData;
	resolved?: unknown;
	poll?: Poll;
	call?: MessageCall;
}

export interface MessagePin {
	pinned_at: string;
	message: Message;
}

export interface GetChannelMessagesParams {
	around?: string;
	before?: string;
	after?: string;
	limit?: number;
}

export interface CreateMessageParams {
	content?: string;
	nonce?: number | string;
	tts?: boolean;
	embeds?: Embed[];
	allowed_mentions?: AllowedMentions;
	message_reference?: MessageReference;
	components?: unknown[];
	sticker_ids?: string[];
	attachments?: Partial<Attachment>[];
	flags?: MessageFlags;
	enforce_nonce?: boolean;
	poll?: Poll;
}

export interface EditMessageParams {
	content?: string | null;
	embeds?: Embed[] | null;
	flags?: MessageFlags;
	allowed_mentions?: AllowedMentions | null;
	components?: unknown[] | null;
	attachments?: Attachment[] | null;
}

export interface BulkDeleteMessagesParams {
	messages: string[];
}

export interface GetReactionsParams {
	type?: ReactionType;
	after?: string;
	limit?: number;
}

export interface GetChannelPinsParams {
	before?: string;
	limit?: number;
}

export interface GetChannelPinsResponse {
	items: MessagePin[];
	has_more: boolean;
}
