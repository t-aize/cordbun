import type {
	Channel,
	Emoji,
	Entitlement,
	Guild,
	GuildMember,
	GuildScheduledEvent,
	Integration,
	Interaction,
	Message,
	Role,
	Sticker,
	ThreadMember,
	User,
	VoiceState,
} from "../resources/index.js";
import type { Activity, GatewayUnavailableGuild, PresenceStatus, ReadyData } from "./types.js";

export interface GatewayEvents {
	ready: ReadyData;
	resumed: null;
	reconnect: null;
	invalid_session: boolean;

	application_command_permissions_update: GatewayApplicationCommandPermissionsUpdate;

	auto_moderation_rule_create: unknown;
	auto_moderation_rule_update: unknown;
	auto_moderation_rule_delete: unknown;
	auto_moderation_action_execution: unknown;

	channel_create: Channel;
	channel_update: Channel;
	channel_delete: Channel;
	channel_pins_update: ChannelPinsUpdate;

	thread_create: Channel & { newly_created?: boolean };
	thread_update: Channel;
	thread_delete: Partial<Channel>;
	thread_list_sync: ThreadListSync;
	thread_member_update: ThreadMember & { guild_id: string };
	thread_members_update: ThreadMembersUpdate;

	entitlement_create: Entitlement;
	entitlement_update: Entitlement;
	entitlement_delete: Entitlement;

	guild_create: Guild | GatewayUnavailableGuild;
	guild_update: Guild;
	guild_delete: GatewayUnavailableGuild;
	guild_audit_log_entry_create: GuildAuditLogEntryCreate;
	guild_ban_add: GuildBanEvent;
	guild_ban_remove: GuildBanEvent;
	guild_emojis_update: GuildEmojisUpdate;
	guild_stickers_update: GuildStickersUpdate;
	guild_integrations_update: GuildIntegrationsUpdate;
	guild_member_add: GuildMember & { guild_id: string };
	guild_member_remove: GuildMemberRemove;
	guild_member_update: GuildMemberUpdate;
	guild_members_chunk: GuildMembersChunk;
	guild_role_create: GuildRoleEvent;
	guild_role_update: GuildRoleEvent;
	guild_role_delete: GuildRoleDelete;

	guild_scheduled_event_create: GuildScheduledEvent;
	guild_scheduled_event_update: GuildScheduledEvent;
	guild_scheduled_event_delete: GuildScheduledEvent;
	guild_scheduled_event_user_add: GuildScheduledEventUserEvent;
	guild_scheduled_event_user_remove: GuildScheduledEventUserEvent;

	guild_soundboard_sound_create: unknown;
	guild_soundboard_sound_update: unknown;
	guild_soundboard_sound_delete: GuildSoundboardSoundDelete;
	guild_soundboard_sounds_update: unknown;
	soundboard_sounds: unknown;

	integration_create: Integration & { guild_id: string };
	integration_update: Integration & { guild_id: string };
	integration_delete: IntegrationDelete;

	interaction_create: Interaction;

	invite_create: InviteCreate;
	invite_delete: InviteDelete;

	message_create: Message;
	message_update: Partial<Message> & { id: string; channel_id: string };
	message_delete: MessageDelete;
	message_delete_bulk: MessageDeleteBulk;
	message_reaction_add: MessageReactionAdd;
	message_reaction_remove: MessageReactionRemove;
	message_reaction_remove_all: MessageReactionRemoveAll;
	message_reaction_remove_emoji: MessageReactionRemoveEmoji;
	message_poll_vote_add: MessagePollVoteEvent;
	message_poll_vote_remove: MessagePollVoteEvent;

	presence_update: PresenceUpdate;

	stage_instance_create: GatewayStageInstance;
	stage_instance_update: GatewayStageInstance;
	stage_instance_delete: GatewayStageInstance;

	subscription_create: GatewaySubscription;
	subscription_update: GatewaySubscription;
	subscription_delete: GatewaySubscription;

	typing_start: TypingStart;

	user_update: User;

	voice_channel_effect_send: VoiceChannelEffectSend;
	voice_state_update: VoiceState;
	voice_server_update: VoiceServerUpdate;

	webhooks_update: WebhooksUpdate;
}

export type GatewayEventName = keyof GatewayEvents;

export interface GatewayApplicationCommandPermissionsUpdate {
	id: string;
	application_id: string;
	guild_id: string;
	permissions: GatewayApplicationCommandPermission[];
}

export interface GatewayApplicationCommandPermission {
	id: string;
	type: number;
	permission: boolean;
}

export interface ChannelPinsUpdate {
	guild_id?: string;
	channel_id: string;
	last_pin_timestamp?: string | null;
}

export interface ThreadListSync {
	guild_id: string;
	channel_ids?: string[];
	threads: Channel[];
	members: ThreadMember[];
}

export interface ThreadMembersUpdate {
	id: string;
	guild_id: string;
	member_count: number;
	added_members?: (ThreadMember & { member?: GuildMember })[];
	removed_member_ids?: string[];
}

export interface GuildAuditLogEntryCreate {
	guild_id: string;
	[key: string]: unknown;
}

export interface GuildBanEvent {
	guild_id: string;
	user: User;
}

export interface GuildEmojisUpdate {
	guild_id: string;
	emojis: Emoji[];
}

export interface GuildStickersUpdate {
	guild_id: string;
	stickers: Sticker[];
}

export interface GuildIntegrationsUpdate {
	guild_id: string;
}

export interface GuildMemberRemove {
	guild_id: string;
	user: User;
}

export interface GuildMemberUpdate {
	guild_id: string;
	roles: string[];
	user: User;
	nick?: string | null;
	avatar?: string | null;
	banner?: string | null;
	joined_at?: string | null;
	premium_since?: string | null;
	deaf?: boolean;
	mute?: boolean;
	pending?: boolean;
	communication_disabled_until?: string | null;
	flags?: number;
}

export interface GuildMembersChunk {
	guild_id: string;
	members: GuildMember[];
	chunk_index: number;
	chunk_count: number;
	not_found?: string[];
	presences?: PresenceUpdate[];
	nonce?: string;
}

export interface GuildRoleEvent {
	guild_id: string;
	role: Role;
}

export interface GuildRoleDelete {
	guild_id: string;
	role_id: string;
}

export interface GuildScheduledEventUserEvent {
	guild_scheduled_event_id: string;
	user_id: string;
	guild_id: string;
}

export interface GuildSoundboardSoundDelete {
	sound_id: string;
	guild_id: string;
}

export interface IntegrationDelete {
	id: string;
	guild_id: string;
	application_id?: string;
}

export interface InviteCreate {
	channel_id: string;
	code: string;
	created_at: string;
	guild_id?: string;
	inviter?: User;
	max_age: number;
	max_uses: number;
	target_type?: number;
	target_user?: User;
	target_application?: unknown;
	temporary: boolean;
	uses: number;
}

export interface InviteDelete {
	channel_id: string;
	guild_id?: string;
	code: string;
}

export interface MessageDelete {
	id: string;
	channel_id: string;
	guild_id?: string;
}

export interface MessageDeleteBulk {
	ids: string[];
	channel_id: string;
	guild_id?: string;
}

export interface MessageReactionAdd {
	user_id: string;
	channel_id: string;
	message_id: string;
	guild_id?: string;
	member?: GuildMember;
	emoji: Partial<Emoji>;
	message_author_id?: string;
	burst: boolean;
	burst_colors?: string[];
	type: number;
}

export interface MessageReactionRemove {
	user_id: string;
	channel_id: string;
	message_id: string;
	guild_id?: string;
	emoji: Partial<Emoji>;
	burst: boolean;
	type: number;
}

export interface MessageReactionRemoveAll {
	channel_id: string;
	message_id: string;
	guild_id?: string;
}

export interface MessageReactionRemoveEmoji {
	channel_id: string;
	message_id: string;
	guild_id?: string;
	emoji: Partial<Emoji>;
}

export interface MessagePollVoteEvent {
	user_id: string;
	channel_id: string;
	message_id: string;
	guild_id?: string;
	answer_id: number;
}

export interface PresenceUpdate {
	user: Partial<User> & { id: string };
	guild_id: string;
	status: PresenceStatus;
	activities: Activity[];
	client_status: ClientStatus;
}

export interface ClientStatus {
	desktop?: PresenceStatus;
	mobile?: PresenceStatus;
	web?: PresenceStatus;
}

export interface GatewayStageInstance {
	id: string;
	guild_id: string;
	channel_id: string;
	topic: string;
	privacy_level: number;
	discoverable_disabled: boolean;
	guild_scheduled_event_id?: string | null;
}

export interface GatewaySubscription {
	id: string;
	user_id: string;
	sku_ids: string[];
	entitlement_ids: string[];
	current_period_start: string;
	current_period_end: string;
	status: number;
	canceled_at?: string | null;
	country?: string;
}

export interface TypingStart {
	channel_id: string;
	guild_id?: string;
	user_id: string;
	timestamp: number;
	member?: GuildMember;
}

export interface VoiceChannelEffectSend {
	channel_id: string;
	guild_id: string;
	user_id: string;
	emoji?: Partial<Emoji> | null;
	animation_type?: number | null;
	animation_id?: number;
	sound_id?: string | number;
	sound_volume?: number;
}

export interface VoiceServerUpdate {
	token: string;
	guild_id: string;
	endpoint: string | null;
}

export interface WebhooksUpdate {
	guild_id: string;
	channel_id: string;
}
