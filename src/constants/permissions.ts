/**
 * Bitwise permission flags for Discord guilds and channels.
 * Permissions are stored in a variable-length integer serialized into a string,
 * and are calculated using bitwise operations.
 *
 * Channel types are abbreviated as: T (Text), V (Voice), S (Stage)
 * @see {@link https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags}
 */
export enum PermissionFlags {
	/** Allows creation of instant invites (T, V, S) */
	CreateInstantInvite = 0x0000000000000001,
	/** Allows kicking members. Requires 2FA for guild-wide moderation */
	KickMembers = 0x0000000000000002,
	/** Allows banning members. Requires 2FA for guild-wide moderation */
	BanMembers = 0x0000000000000004,
	/** Allows all permissions and bypasses channel permission overwrites. Requires 2FA for guild-wide moderation */
	Administrator = 0x0000000000000008,
	/** Allows management and editing of channels (T, V, S). Requires 2FA for guild-wide moderation */
	ManageChannels = 0x0000000000000010,
	/** Allows management and editing of the guild. Requires 2FA for guild-wide moderation */
	ManageGuild = 0x0000000000000020,
	/** Allows for adding new reactions to messages. Does not apply to reacting with an existing reaction (T, V, S) */
	AddReactions = 0x0000000000000040,
	/** Allows for viewing of audit logs */
	ViewAuditLog = 0x0000000000000080,
	/** Allows for using priority speaker in a voice channel (V) */
	PrioritySpeaker = 0x0000000000000100,
	/** Allows the user to go live (V, S) */
	Stream = 0x0000000000000200,
	/** Allows guild members to view a channel, which includes reading messages in text channels and joining voice channels (T, V, S) */
	ViewChannel = 0x0000000000000400,
	/** Allows for sending messages in a channel and creating threads in a forum (does not allow sending messages in threads) (T, V, S) */
	SendMessages = 0x0000000000000800,
	/** Allows for sending of /tts messages (T, V, S) */
	SendTtsMessages = 0x0000000000001000,
	/** Allows for deletion of other users messages (T, V, S). Requires 2FA for guild-wide moderation */
	ManageMessages = 0x0000000000002000,
	/** Links sent by users with this permission will be auto-embedded (T, V, S) */
	EmbedLinks = 0x0000000000004000,
	/** Allows for uploading images and files (T, V, S) */
	AttachFiles = 0x0000000000008000,
	/** Allows for reading of message history (T, V, S) */
	ReadMessageHistory = 0x0000000000010000,
	/** Allows for using the @everyone tag to notify all users in a channel, and the @here tag to notify all online users in a channel (T, V, S) */
	MentionEveryone = 0x0000000000020000,
	/** Allows the usage of custom emojis from other servers (T, V, S) */
	UseExternalEmojis = 0x0000000000040000,
	/** Allows for viewing guild insights */
	ViewGuildInsights = 0x0000000000080000,
	/** Allows for joining of a voice channel (V, S) */
	Connect = 0x0000000000100000,
	/** Allows for speaking in a voice channel (V) */
	Speak = 0x0000000000200000,
	/** Allows for muting members in a voice channel (V, S) */
	MuteMembers = 0x0000000000400000,
	/** Allows for deafening of members in a voice channel (V) */
	DeafenMembers = 0x0000000000800000,
	/** Allows for moving of members between voice channels (V, S) */
	MoveMembers = 0x0000000001000000,
	/** Allows for using voice-activity-detection in a voice channel (V) */
	UseVad = 0x0000000002000000,
	/** Allows for modification of own nickname */
	ChangeNickname = 0x0000000004000000,
	/** Allows for modification of other users nicknames */
	ManageNicknames = 0x0000000008000000,
	/** Allows management and editing of roles (T, V, S). Requires 2FA for guild-wide moderation */
	ManageRoles = 0x0000000010000000,
	/** Allows management and editing of webhooks (T, V, S). Requires 2FA for guild-wide moderation */
	ManageWebhooks = 0x0000000020000000,
	/** Allows for editing and deleting emojis, stickers, and soundboard sounds created by all users. Requires 2FA for guild-wide moderation */
	ManageGuildExpressions = 0x0000000040000000,
	/** Allows members to use application commands, including slash commands and context menu commands (T, V, S) */
	UseApplicationCommands = 0x0000000080000000,
	/** Allows for requesting to speak in stage channels (S). This permission is under active development and may be changed or removed */
	RequestToSpeak = 0x0000000100000000,
	/** Allows for editing and deleting scheduled events created by all users (V, S) */
	ManageEvents = 0x0000000200000000,
	/** Allows for deleting and archiving threads, and viewing all private threads (T). Requires 2FA for guild-wide moderation */
	ManageThreads = 0x0000000400000000,
	/** Allows for creating public and announcement threads (T) */
	CreatePublicThreads = 0x0000000800000000,
	/** Allows for creating private threads (T) */
	CreatePrivateThreads = 0x0000001000000000,
	/** Allows the usage of custom stickers from other servers (T, V, S) */
	UseExternalStickers = 0x0000002000000000,
	/** Allows for sending messages in threads (T) */
	SendMessagesInThreads = 0x0000004000000000,
	/** Allows for using Activities (applications with the EMBEDDED flag) (T, V) */
	UseEmbeddedActivities = 0x0000008000000000,
	/** Allows for timing out users to prevent them from sending or reacting to messages in chat and threads, and from speaking in voice and stage channels */
	ModerateMembers = 0x0000010000000000,
	/** Allows for viewing role subscription insights. Requires 2FA for guild-wide moderation */
	ViewCreatorMonetizationAnalytics = 0x0000020000000000,
	/** Allows for using soundboard in a voice channel (V) */
	UseSoundboard = 0x0000040000000000,
	/** Allows for creating emojis, stickers, and soundboard sounds, and editing and deleting those created by the current user */
	CreateGuildExpressions = 0x0000080000000000,
	/** Allows for creating scheduled events, and editing and deleting those created by the current user (V, S) */
	CreateEvents = 0x0000100000000000,
	/** Allows the usage of custom soundboard sounds from other servers (V) */
	UseExternalSounds = 0x0000200000000000,
	/** Allows sending voice messages (T, V, S) */
	SendVoiceMessages = 0x0000400000000000,
	/** Allows sending polls (T, V, S) */
	SendPolls = 0x0002000000000000,
	/** Allows user-installed apps to send public responses. When disabled, users will still be allowed to use their apps but the responses will be ephemeral (T, V, S) */
	UseExternalApps = 0x0004000000000000,
	/** Allows pinning and unpinning messages (T) */
	PinMessages = 0x0008000000000000,
	/** Allows bypassing slowmode restrictions (T, V, S) */
	BypassSlowmode = 0x0010000000000000,
}
