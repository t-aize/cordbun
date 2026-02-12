/**
 * Gateway intents are bitwise values passed when identifying which correlate to a set of related events.
 * If you do not specify an intent when identifying, you will not receive any of the Gateway events associated with that intent.
 * @see {@link https://discord.com/developers/docs/events/gateway#gateway-intents}
 */
export enum GatewayIntent {
	/**
	 * Includes events: GUILD_CREATE, GUILD_UPDATE, GUILD_DELETE, GUILD_ROLE_CREATE, GUILD_ROLE_UPDATE,
	 * GUILD_ROLE_DELETE, CHANNEL_CREATE, CHANNEL_UPDATE, CHANNEL_DELETE, CHANNEL_PINS_UPDATE,
	 * THREAD_CREATE, THREAD_UPDATE, THREAD_DELETE, THREAD_LIST_SYNC, THREAD_MEMBER_UPDATE,
	 * THREAD_MEMBERS_UPDATE, STAGE_INSTANCE_CREATE, STAGE_INSTANCE_UPDATE, STAGE_INSTANCE_DELETE
	 */
	Guilds = 1 << 0,
	/**
	 * Includes events: GUILD_MEMBER_ADD, GUILD_MEMBER_UPDATE, GUILD_MEMBER_REMOVE, THREAD_MEMBERS_UPDATE
	 *
	 * This is a privileged intent that must be enabled in the Developer Portal and approved for verified apps.
	 */
	GuildMembers = 1 << 1,
	/**
	 * Includes events: GUILD_AUDIT_LOG_ENTRY_CREATE, GUILD_BAN_ADD, GUILD_BAN_REMOVE
	 */
	GuildModeration = 1 << 2,
	/**
	 * Includes events: GUILD_EMOJIS_UPDATE, GUILD_STICKERS_UPDATE, GUILD_SOUNDBOARD_SOUND_CREATE,
	 * GUILD_SOUNDBOARD_SOUND_UPDATE, GUILD_SOUNDBOARD_SOUND_DELETE, GUILD_SOUNDBOARD_SOUNDS_UPDATE
	 */
	GuildExpressions = 1 << 3,
	/**
	 * Includes events: GUILD_INTEGRATIONS_UPDATE, INTEGRATION_CREATE, INTEGRATION_UPDATE, INTEGRATION_DELETE
	 */
	GuildIntegrations = 1 << 4,
	/**
	 * Includes events: WEBHOOKS_UPDATE
	 */
	GuildWebhooks = 1 << 5,
	/**
	 * Includes events: INVITE_CREATE, INVITE_DELETE
	 */
	GuildInvites = 1 << 6,
	/**
	 * Includes events: VOICE_CHANNEL_EFFECT_SEND, VOICE_STATE_UPDATE
	 */
	GuildVoiceStates = 1 << 7,
	/**
	 * Includes events: PRESENCE_UPDATE
	 *
	 * This is a privileged intent that must be enabled in the Developer Portal and approved for verified apps.
	 */
	GuildPresences = 1 << 8,
	/**
	 * Includes events: MESSAGE_CREATE, MESSAGE_UPDATE, MESSAGE_DELETE, MESSAGE_DELETE_BULK
	 */
	GuildMessages = 1 << 9,
	/**
	 * Includes events: MESSAGE_REACTION_ADD, MESSAGE_REACTION_REMOVE, MESSAGE_REACTION_REMOVE_ALL, MESSAGE_REACTION_REMOVE_EMOJI
	 */
	GuildMessageReactions = 1 << 10,
	/**
	 * Includes events: TYPING_START
	 */
	GuildMessageTyping = 1 << 11,
	/**
	 * Includes events: MESSAGE_CREATE, MESSAGE_UPDATE, MESSAGE_DELETE, CHANNEL_PINS_UPDATE
	 */
	DirectMessages = 1 << 12,
	/**
	 * Includes events: MESSAGE_REACTION_ADD, MESSAGE_REACTION_REMOVE, MESSAGE_REACTION_REMOVE_ALL, MESSAGE_REACTION_REMOVE_EMOJI
	 */
	DirectMessageReactions = 1 << 13,
	/**
	 * Includes events: TYPING_START
	 */
	DirectMessageTyping = 1 << 14,
	/**
	 * This intent affects what data is present for events that could contain message content fields.
	 *
	 * This is a privileged intent that must be enabled in the Developer Portal and approved for verified apps.
	 * @see {@link https://discord.com/developers/docs/events/gateway#message-content-intent}
	 */
	MessageContent = 1 << 15,
	/**
	 * Includes events: GUILD_SCHEDULED_EVENT_CREATE, GUILD_SCHEDULED_EVENT_UPDATE, GUILD_SCHEDULED_EVENT_DELETE,
	 * GUILD_SCHEDULED_EVENT_USER_ADD, GUILD_SCHEDULED_EVENT_USER_REMOVE
	 */
	GuildScheduledEvents = 1 << 16,
	/**
	 * Includes events: AUTO_MODERATION_RULE_CREATE, AUTO_MODERATION_RULE_UPDATE, AUTO_MODERATION_RULE_DELETE
	 */
	AutoModerationConfiguration = 1 << 20,
	/**
	 * Includes events: AUTO_MODERATION_ACTION_EXECUTION
	 */
	AutoModerationExecution = 1 << 21,
	/**
	 * Includes events: MESSAGE_POLL_VOTE_ADD, MESSAGE_POLL_VOTE_REMOVE (for guild messages)
	 */
	GuildMessagePolls = 1 << 24,
	/**
	 * Includes events: MESSAGE_POLL_VOTE_ADD, MESSAGE_POLL_VOTE_REMOVE (for direct messages)
	 */
	DirectMessagePolls = 1 << 25,
}

/**
 * Privileged intents require you to toggle the intent for your app in your app's settings
 * within the Developer Portal before passing said intent.
 * For verified apps, the intent must also be approved after the verification process.
 *
 * Includes: GUILD_MEMBERS, GUILD_PRESENCES, MESSAGE_CONTENT
 * @see {@link https://discord.com/developers/docs/events/gateway#privileged-intents}
 */
export const PrivilegedIntents =
	GatewayIntent.GuildMembers | GatewayIntent.GuildPresences | GatewayIntent.MessageContent;

/**
 * A bitfield containing all available Gateway intents.
 */
export const AllIntents = Object.values(GatewayIntent)
	.filter((v): v is number => typeof v === "number")
	.reduce((acc, v) => acc | v, 0);

/**
 * A bitfield containing all non-privileged Gateway intents.
 * These intents can be used without enabling them in the Developer Portal.
 */
export const AllNonPrivilegedIntents = AllIntents & ~PrivilegedIntents;
