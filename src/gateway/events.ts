import type {
	AutoModerationAction,
	AutoModerationRule,
	AutoModerationTriggerType,
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
	SoundboardSound,
	StageInstance,
	Sticker,
	Subscription,
	ThreadMember,
	User,
	VoiceState,
} from "../resources/index.js";
import type { GatewayCloseEvent, GatewayPayload, GatewayReady, GatewayStatus } from "./types.js";

/**
 * All Gateway dispatch event names.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#receive-events}
 */
export type GatewayDispatchEventName =
	| "READY"
	| "RESUMED"
	| "APPLICATION_COMMAND_PERMISSIONS_UPDATE"
	| "AUTO_MODERATION_RULE_CREATE"
	| "AUTO_MODERATION_RULE_UPDATE"
	| "AUTO_MODERATION_RULE_DELETE"
	| "AUTO_MODERATION_ACTION_EXECUTION"
	| "CHANNEL_CREATE"
	| "CHANNEL_UPDATE"
	| "CHANNEL_DELETE"
	| "CHANNEL_PINS_UPDATE"
	| "THREAD_CREATE"
	| "THREAD_UPDATE"
	| "THREAD_DELETE"
	| "THREAD_LIST_SYNC"
	| "THREAD_MEMBER_UPDATE"
	| "THREAD_MEMBERS_UPDATE"
	| "ENTITLEMENT_CREATE"
	| "ENTITLEMENT_UPDATE"
	| "ENTITLEMENT_DELETE"
	| "GUILD_CREATE"
	| "GUILD_UPDATE"
	| "GUILD_DELETE"
	| "GUILD_AUDIT_LOG_ENTRY_CREATE"
	| "GUILD_BAN_ADD"
	| "GUILD_BAN_REMOVE"
	| "GUILD_EMOJIS_UPDATE"
	| "GUILD_STICKERS_UPDATE"
	| "GUILD_INTEGRATIONS_UPDATE"
	| "GUILD_MEMBER_ADD"
	| "GUILD_MEMBER_REMOVE"
	| "GUILD_MEMBER_UPDATE"
	| "GUILD_MEMBERS_CHUNK"
	| "GUILD_ROLE_CREATE"
	| "GUILD_ROLE_UPDATE"
	| "GUILD_ROLE_DELETE"
	| "GUILD_SCHEDULED_EVENT_CREATE"
	| "GUILD_SCHEDULED_EVENT_UPDATE"
	| "GUILD_SCHEDULED_EVENT_DELETE"
	| "GUILD_SCHEDULED_EVENT_USER_ADD"
	| "GUILD_SCHEDULED_EVENT_USER_REMOVE"
	| "GUILD_SOUNDBOARD_SOUND_CREATE"
	| "GUILD_SOUNDBOARD_SOUND_UPDATE"
	| "GUILD_SOUNDBOARD_SOUND_DELETE"
	| "GUILD_SOUNDBOARD_SOUNDS_UPDATE"
	| "SOUNDBOARD_SOUNDS"
	| "INTEGRATION_CREATE"
	| "INTEGRATION_UPDATE"
	| "INTEGRATION_DELETE"
	| "INTERACTION_CREATE"
	| "INVITE_CREATE"
	| "INVITE_DELETE"
	| "MESSAGE_CREATE"
	| "MESSAGE_UPDATE"
	| "MESSAGE_DELETE"
	| "MESSAGE_DELETE_BULK"
	| "MESSAGE_REACTION_ADD"
	| "MESSAGE_REACTION_REMOVE"
	| "MESSAGE_REACTION_REMOVE_ALL"
	| "MESSAGE_REACTION_REMOVE_EMOJI"
	| "PRESENCE_UPDATE"
	| "STAGE_INSTANCE_CREATE"
	| "STAGE_INSTANCE_UPDATE"
	| "STAGE_INSTANCE_DELETE"
	| "SUBSCRIPTION_CREATE"
	| "SUBSCRIPTION_UPDATE"
	| "SUBSCRIPTION_DELETE"
	| "TYPING_START"
	| "USER_UPDATE"
	| "VOICE_CHANNEL_EFFECT_SEND"
	| "VOICE_STATE_UPDATE"
	| "VOICE_SERVER_UPDATE"
	| "WEBHOOKS_UPDATE"
	| "MESSAGE_POLL_VOTE_ADD"
	| "MESSAGE_POLL_VOTE_REMOVE";

// ============================================================================
// Gateway Client Events (emitted by the Gateway class)
// ============================================================================

/**
 * Events emitted by the Gateway client.
 */
export interface GatewayClientEvents {
	/** Emitted when the gateway connection is ready */
	ready: [data: GatewayReady];
	/** Emitted when a session is successfully resumed */
	resumed: [];
	/** Emitted when a raw gateway payload is received */
	raw: [payload: GatewayPayload];
	/** Emitted when a dispatch event is received */
	dispatch: [eventName: GatewayDispatchEventName, data: unknown];
	/** Emitted when the gateway connection is closed */
	close: [event: GatewayCloseEvent];
	/** Emitted when an error occurs */
	error: [error: Error];
	/** Emitted when the gateway status changes */
	statusChange: [status: GatewayStatus];
	/** Emitted for debug information */
	debug: [message: string];
}

// ============================================================================
// Gateway Dispatch Event Payloads
// ============================================================================

/**
 * Channel Pins Update event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#channel-pins-update}
 */
export interface ChannelPinsUpdateEvent {
	/** ID of the guild */
	guild_id?: string;
	/** ID of the channel */
	channel_id: string;
	/** Time at which the most recent pinned message was pinned */
	last_pin_timestamp?: string | null;
}

/**
 * Thread List Sync event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#thread-list-sync}
 */
export interface ThreadListSyncEvent {
	/** ID of the guild */
	guild_id: string;
	/** Parent channel IDs whose threads are being synced */
	channel_ids?: string[];
	/** All active threads in the given channels that the current user can access */
	threads: Channel[];
	/** All thread member objects from the synced threads for the current user */
	members: ThreadMember[];
}

/**
 * Thread Members Update event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#thread-members-update}
 */
export interface ThreadMembersUpdateEvent {
	/** ID of the thread */
	id: string;
	/** ID of the guild */
	guild_id: string;
	/** Approximate number of members in the thread, capped at 50 */
	member_count: number;
	/** Users who were added to the thread */
	added_members?: (ThreadMember & { member?: GuildMember; presence?: PresenceUpdateEvent })[];
	/** ID of the users who were removed from the thread */
	removed_member_ids?: string[];
}

/**
 * Guild Ban Add/Remove event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#guild-ban-add}
 */
export interface GuildBanEvent {
	/** ID of the guild */
	guild_id: string;
	/** User who was banned/unbanned */
	user: User;
}

/**
 * Guild Emojis Update event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#guild-emojis-update}
 */
export interface GuildEmojisUpdateEvent {
	/** ID of the guild */
	guild_id: string;
	/** Array of emojis */
	emojis: Emoji[];
}

/**
 * Guild Stickers Update event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#guild-stickers-update}
 */
export interface GuildStickersUpdateEvent {
	/** ID of the guild */
	guild_id: string;
	/** Array of stickers */
	stickers: Sticker[];
}

/**
 * Guild Integrations Update event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#guild-integrations-update}
 */
export interface GuildIntegrationsUpdateEvent {
	/** ID of the guild whose integrations were updated */
	guild_id: string;
}

/**
 * Guild Member Remove event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#guild-member-remove}
 */
export interface GuildMemberRemoveEvent {
	/** ID of the guild */
	guild_id: string;
	/** User who was removed */
	user: User;
}

/**
 * Guild Member Update event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#guild-member-update}
 */
export interface GuildMemberUpdateEvent {
	/** ID of the guild */
	guild_id: string;
	/** User role IDs */
	roles: string[];
	/** User */
	user: User;
	/** Nickname of the user in the guild */
	nick?: string | null;
	/** Member's guild avatar hash */
	avatar: string | null;
	/** Member's guild banner hash */
	banner: string | null;
	/** When the user joined the guild */
	joined_at: string | null;
	/** When the user started boosting the guild */
	premium_since?: string | null;
	/** Whether the user is deafened in voice channels */
	deaf?: boolean;
	/** Whether the user is muted in voice channels */
	mute?: boolean;
	/** Whether the user has not yet passed the guild's Membership Screening requirements */
	pending?: boolean;
	/** When the user's timeout will expire */
	communication_disabled_until?: string | null;
	/** Guild member flags */
	flags?: number;
}

/**
 * Guild Members Chunk event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#guild-members-chunk}
 */
export interface GuildMembersChunkEvent {
	/** ID of the guild */
	guild_id: string;
	/** Set of guild members */
	members: GuildMember[];
	/** Chunk index in the expected chunks for this response */
	chunk_index: number;
	/** Total number of expected chunks for this response */
	chunk_count: number;
	/** When passing an invalid ID to REQUEST_GUILD_MEMBERS, it will be returned here */
	not_found?: string[];
	/** When passing true to REQUEST_GUILD_MEMBERS, presences of the returned members will be here */
	presences?: PresenceUpdateEvent[];
	/** Nonce used in the Guild Members Request */
	nonce?: string;
}

/**
 * Guild Role Create/Update event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#guild-role-create}
 */
export interface GuildRoleEvent {
	/** ID of the guild */
	guild_id: string;
	/** Role that was created/updated */
	role: Role;
}

/**
 * Guild Role Delete event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#guild-role-delete}
 */
export interface GuildRoleDeleteEvent {
	/** ID of the guild */
	guild_id: string;
	/** ID of the role */
	role_id: string;
}

/**
 * Guild Scheduled Event User Add/Remove event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#guild-scheduled-event-user-add}
 */
export interface GuildScheduledEventUserEvent {
	/** ID of the guild scheduled event */
	guild_scheduled_event_id: string;
	/** ID of the user */
	user_id: string;
	/** ID of the guild */
	guild_id: string;
}

/**
 * Guild Soundboard Sound Delete event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#guild-soundboard-sound-delete}
 */
export interface GuildSoundboardSoundDeleteEvent {
	/** ID of the sound that was deleted */
	sound_id: string;
	/** ID of the guild the sound was in */
	guild_id: string;
}

/**
 * Guild Soundboard Sounds Update event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#guild-soundboard-sounds-update}
 */
export interface GuildSoundboardSoundsUpdateEvent {
	/** The guild's soundboard sounds */
	soundboard_sounds: SoundboardSound[];
	/** ID of the guild */
	guild_id: string;
}

/**
 * Soundboard Sounds event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#soundboard-sounds}
 */
export interface SoundboardSoundsEvent {
	/** The guild's soundboard sounds */
	soundboard_sounds: SoundboardSound[];
	/** ID of the guild */
	guild_id: string;
}

/**
 * Integration Delete event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#integration-delete}
 */
export interface IntegrationDeleteEvent {
	/** Integration ID */
	id: string;
	/** ID of the guild */
	guild_id: string;
	/** ID of the bot/OAuth2 application for this discord integration */
	application_id?: string;
}

/**
 * Invite Create event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#invite-create}
 */
export interface InviteCreateEvent {
	/** Channel the invite is for */
	channel_id: string;
	/** Unique invite code */
	code: string;
	/** Time at which the invite was created */
	created_at: string;
	/** Guild of the invite */
	guild_id?: string;
	/** User that created the invite */
	inviter?: User;
	/** How long the invite is valid for (in seconds) */
	max_age: number;
	/** Maximum number of times the invite can be used */
	max_uses: number;
	/** Type of target for this voice channel invite */
	target_type?: number;
	/** User whose stream to display for this voice channel stream invite */
	target_user?: User;
	/** Embedded application to open for this voice channel embedded application invite */
	target_application?: { id: string; name: string; icon: string | null };
	/** Whether or not the invite is temporary */
	temporary: boolean;
	/** How many times the invite has been used (always will be 0) */
	uses: number;
	/** The expiration date of this invite */
	expires_at: string | null;
}

/**
 * Invite Delete event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#invite-delete}
 */
export interface InviteDeleteEvent {
	/** Channel of the invite */
	channel_id: string;
	/** Guild of the invite */
	guild_id?: string;
	/** Unique invite code */
	code: string;
}

/**
 * Message Delete event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#message-delete}
 */
export interface MessageDeleteEvent {
	/** ID of the message */
	id: string;
	/** ID of the channel */
	channel_id: string;
	/** ID of the guild */
	guild_id?: string;
}

/**
 * Message Delete Bulk event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#message-delete-bulk}
 */
export interface MessageDeleteBulkEvent {
	/** IDs of the messages */
	ids: string[];
	/** ID of the channel */
	channel_id: string;
	/** ID of the guild */
	guild_id?: string;
}

/**
 * Message Reaction Add event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#message-reaction-add}
 */
export interface MessageReactionAddEvent {
	/** ID of the user */
	user_id: string;
	/** ID of the channel */
	channel_id: string;
	/** ID of the message */
	message_id: string;
	/** ID of the guild */
	guild_id?: string;
	/** Member who reacted if this happened in a guild */
	member?: GuildMember;
	/** Emoji used to react */
	emoji: Partial<Emoji>;
	/** ID of the user who authored the message which was reacted to */
	message_author_id?: string;
	/** Whether this is a super-reaction */
	burst: boolean;
	/** Colors used for super-reaction animation in "#rrggbb" format */
	burst_colors?: string[];
	/** The type of reaction */
	type: number;
}

/**
 * Message Reaction Remove event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#message-reaction-remove}
 */
export interface MessageReactionRemoveEvent {
	/** ID of the user */
	user_id: string;
	/** ID of the channel */
	channel_id: string;
	/** ID of the message */
	message_id: string;
	/** ID of the guild */
	guild_id?: string;
	/** Emoji used to react */
	emoji: Partial<Emoji>;
	/** Whether this was a super-reaction */
	burst: boolean;
	/** The type of reaction */
	type: number;
}

/**
 * Message Reaction Remove All event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#message-reaction-remove-all}
 */
export interface MessageReactionRemoveAllEvent {
	/** ID of the channel */
	channel_id: string;
	/** ID of the message */
	message_id: string;
	/** ID of the guild */
	guild_id?: string;
}

/**
 * Message Reaction Remove Emoji event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#message-reaction-remove-emoji}
 */
export interface MessageReactionRemoveEmojiEvent {
	/** ID of the channel */
	channel_id: string;
	/** ID of the guild */
	guild_id?: string;
	/** ID of the message */
	message_id: string;
	/** Emoji that was removed */
	emoji: Partial<Emoji>;
}

/**
 * Presence Update event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#presence-update}
 */
export interface PresenceUpdateEvent {
	/** User whose presence is being updated */
	user: Partial<User> & { id: string };
	/** ID of the guild */
	guild_id: string;
	/** Either "idle", "dnd", "online", or "offline" */
	status: string;
	/** User's current activities */
	activities: unknown[];
	/** User's platform-dependent status */
	client_status: {
		desktop?: string;
		mobile?: string;
		web?: string;
	};
}

/**
 * Typing Start event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#typing-start}
 */
export interface TypingStartEvent {
	/** ID of the channel */
	channel_id: string;
	/** ID of the guild */
	guild_id?: string;
	/** ID of the user */
	user_id: string;
	/** Unix time (in seconds) of when the user started typing */
	timestamp: number;
	/** Member who started typing if this happened in a guild */
	member?: GuildMember;
}

/**
 * Voice Channel Effect Send event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#voice-channel-effect-send}
 */
export interface VoiceChannelEffectSendEvent {
	/** ID of the channel the effect was sent in */
	channel_id: string;
	/** ID of the guild the effect was sent in */
	guild_id: string;
	/** ID of the user who sent the effect */
	user_id: string;
	/** The emoji sent, for emoji reaction and soundboard effects */
	emoji?: Partial<Emoji>;
	/** The type of emoji animation, for emoji reaction and soundboard effects */
	animation_type?: number;
	/** The ID of the emoji animation, for emoji reaction and soundboard effects */
	animation_id?: number;
	/** The ID of the soundboard sound, for soundboard effects */
	sound_id?: string | number;
	/** The volume of the soundboard sound, from 0 to 1, for soundboard effects */
	sound_volume?: number;
}

/**
 * Voice Server Update event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#voice-server-update}
 */
export interface VoiceServerUpdateEvent {
	/** Voice connection token */
	token: string;
	/** ID of the guild this voice server update is for */
	guild_id: string;
	/** Voice server host */
	endpoint: string | null;
}

/**
 * Webhooks Update event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#webhooks-update}
 */
export interface WebhooksUpdateEvent {
	/** ID of the guild */
	guild_id: string;
	/** ID of the channel */
	channel_id: string;
}

/**
 * Message Poll Vote Add/Remove event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#message-poll-vote-add}
 */
export interface MessagePollVoteEvent {
	/** ID of the user */
	user_id: string;
	/** ID of the channel */
	channel_id: string;
	/** ID of the message */
	message_id: string;
	/** ID of the guild */
	guild_id?: string;
	/** ID of the answer */
	answer_id: number;
}

/**
 * Auto Moderation Action Execution event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#auto-moderation-action-execution}
 */
export interface AutoModerationActionExecutionEvent {
	/** ID of the guild in which action was executed */
	guild_id: string;
	/** Action which was executed */
	action: AutoModerationAction;
	/** ID of the rule which action belongs to */
	rule_id: string;
	/** Trigger type of rule which was triggered */
	rule_trigger_type: AutoModerationTriggerType;
	/** ID of the user which generated the content which triggered the rule */
	user_id: string;
	/** ID of the channel in which user content was posted */
	channel_id?: string;
	/** ID of any user message which content belongs to */
	message_id?: string;
	/** ID of any system auto moderation messages posted as a result of this action */
	alert_system_message_id?: string;
	/** User-generated text content */
	content?: string;
	/** Word or phrase configured in the rule that triggered the rule */
	matched_keyword: string | null;
	/** Substring in content that triggered the rule */
	matched_content?: string | null;
}

/**
 * Guild Audit Log Entry Create event payload.
 * @see {@link https://discord.com/developers/docs/events/gateway-events#guild-audit-log-entry-create}
 */
export interface GuildAuditLogEntryCreateEvent {
	/** ID of the guild */
	guild_id: string;
	/** ID of the affected entity (webhook, user, role, etc.) */
	target_id: string | null;
	/** User or app that made the changes */
	user_id: string | null;
	/** ID of the entry */
	id: string;
	/** Type of action that occurred */
	action_type: number;
	/** Additional info for certain event types */
	options?: unknown;
	/** Reason for the change */
	reason?: string;
}

/**
 * Mapping of dispatch event names to their payload types.
 */
export interface GatewayDispatchEvents {
	READY: GatewayReady;
	RESUMED: undefined;
	APPLICATION_COMMAND_PERMISSIONS_UPDATE: unknown;
	AUTO_MODERATION_RULE_CREATE: AutoModerationRule;
	AUTO_MODERATION_RULE_UPDATE: AutoModerationRule;
	AUTO_MODERATION_RULE_DELETE: AutoModerationRule;
	AUTO_MODERATION_ACTION_EXECUTION: AutoModerationActionExecutionEvent;
	CHANNEL_CREATE: Channel;
	CHANNEL_UPDATE: Channel;
	CHANNEL_DELETE: Channel;
	CHANNEL_PINS_UPDATE: ChannelPinsUpdateEvent;
	THREAD_CREATE: Channel & { newly_created?: boolean; member?: ThreadMember };
	THREAD_UPDATE: Channel;
	THREAD_DELETE: Pick<Channel, "id" | "guild_id" | "parent_id" | "type">;
	THREAD_LIST_SYNC: ThreadListSyncEvent;
	THREAD_MEMBER_UPDATE: ThreadMember & { guild_id: string };
	THREAD_MEMBERS_UPDATE: ThreadMembersUpdateEvent;
	ENTITLEMENT_CREATE: Entitlement;
	ENTITLEMENT_UPDATE: Entitlement;
	ENTITLEMENT_DELETE: Entitlement;
	GUILD_CREATE: Guild & { unavailable?: boolean };
	GUILD_UPDATE: Guild;
	GUILD_DELETE: { id: string; unavailable?: boolean };
	GUILD_AUDIT_LOG_ENTRY_CREATE: GuildAuditLogEntryCreateEvent;
	GUILD_BAN_ADD: GuildBanEvent;
	GUILD_BAN_REMOVE: GuildBanEvent;
	GUILD_EMOJIS_UPDATE: GuildEmojisUpdateEvent;
	GUILD_STICKERS_UPDATE: GuildStickersUpdateEvent;
	GUILD_INTEGRATIONS_UPDATE: GuildIntegrationsUpdateEvent;
	GUILD_MEMBER_ADD: GuildMember & { guild_id: string };
	GUILD_MEMBER_REMOVE: GuildMemberRemoveEvent;
	GUILD_MEMBER_UPDATE: GuildMemberUpdateEvent;
	GUILD_MEMBERS_CHUNK: GuildMembersChunkEvent;
	GUILD_ROLE_CREATE: GuildRoleEvent;
	GUILD_ROLE_UPDATE: GuildRoleEvent;
	GUILD_ROLE_DELETE: GuildRoleDeleteEvent;
	GUILD_SCHEDULED_EVENT_CREATE: GuildScheduledEvent;
	GUILD_SCHEDULED_EVENT_UPDATE: GuildScheduledEvent;
	GUILD_SCHEDULED_EVENT_DELETE: GuildScheduledEvent;
	GUILD_SCHEDULED_EVENT_USER_ADD: GuildScheduledEventUserEvent;
	GUILD_SCHEDULED_EVENT_USER_REMOVE: GuildScheduledEventUserEvent;
	GUILD_SOUNDBOARD_SOUND_CREATE: SoundboardSound;
	GUILD_SOUNDBOARD_SOUND_UPDATE: SoundboardSound;
	GUILD_SOUNDBOARD_SOUND_DELETE: GuildSoundboardSoundDeleteEvent;
	GUILD_SOUNDBOARD_SOUNDS_UPDATE: GuildSoundboardSoundsUpdateEvent;
	SOUNDBOARD_SOUNDS: SoundboardSoundsEvent;
	INTEGRATION_CREATE: Integration & { guild_id: string };
	INTEGRATION_UPDATE: Integration & { guild_id: string };
	INTEGRATION_DELETE: IntegrationDeleteEvent;
	INTERACTION_CREATE: Interaction;
	INVITE_CREATE: InviteCreateEvent;
	INVITE_DELETE: InviteDeleteEvent;
	MESSAGE_CREATE: Message;
	MESSAGE_UPDATE: Partial<Message> & { id: string; channel_id: string };
	MESSAGE_DELETE: MessageDeleteEvent;
	MESSAGE_DELETE_BULK: MessageDeleteBulkEvent;
	MESSAGE_REACTION_ADD: MessageReactionAddEvent;
	MESSAGE_REACTION_REMOVE: MessageReactionRemoveEvent;
	MESSAGE_REACTION_REMOVE_ALL: MessageReactionRemoveAllEvent;
	MESSAGE_REACTION_REMOVE_EMOJI: MessageReactionRemoveEmojiEvent;
	PRESENCE_UPDATE: PresenceUpdateEvent;
	STAGE_INSTANCE_CREATE: StageInstance;
	STAGE_INSTANCE_UPDATE: StageInstance;
	STAGE_INSTANCE_DELETE: StageInstance;
	SUBSCRIPTION_CREATE: Subscription;
	SUBSCRIPTION_UPDATE: Subscription;
	SUBSCRIPTION_DELETE: Subscription;
	TYPING_START: TypingStartEvent;
	USER_UPDATE: User;
	VOICE_CHANNEL_EFFECT_SEND: VoiceChannelEffectSendEvent;
	VOICE_STATE_UPDATE: VoiceState;
	VOICE_SERVER_UPDATE: VoiceServerUpdateEvent;
	WEBHOOKS_UPDATE: WebhooksUpdateEvent;
	MESSAGE_POLL_VOTE_ADD: MessagePollVoteEvent;
	MESSAGE_POLL_VOTE_REMOVE: MessagePollVoteEvent;
}
