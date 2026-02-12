/**
 * Gateway opcodes for Discord's WebSocket gateway.
 * All gateway events are tagged with an opcode that denotes the payload type.
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes}
 */
export enum GatewayOpcode {
	/** An event was dispatched (Receive) */
	Dispatch = 0,
	/** Fired periodically by the client to keep the connection alive (Send/Receive) */
	Heartbeat = 1,
	/** Starts a new session during the initial handshake (Send) */
	Identify = 2,
	/** Update the client's presence (Send) */
	PresenceUpdate = 3,
	/** Used to join/leave or move between voice channels (Send) */
	VoiceStateUpdate = 4,
	/** Resume a previous session that was disconnected (Send) */
	Resume = 6,
	/** You should attempt to reconnect and resume immediately (Receive) */
	Reconnect = 7,
	/** Request information about offline guild members in a large guild (Send) */
	RequestGuildMembers = 8,
	/** The session has been invalidated. You should reconnect and identify/resume accordingly (Receive) */
	InvalidSession = 9,
	/** Sent immediately after connecting, contains the `heartbeat_interval` to use (Receive) */
	Hello = 10,
	/** Sent in response to receiving a heartbeat to acknowledge that it has been received (Receive) */
	HeartbeatAck = 11,
	/** Request information about soundboard sounds in a set of guilds (Send) */
	RequestSoundboardSounds = 31,
}

/**
 * Gateway close event codes.
 * In order to prevent broken reconnect loops, you should consider some close codes
 * as a signal to stop reconnecting.
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes}
 */
export enum GatewayCloseCode {
	/** We're not sure what went wrong. Try reconnecting? (Reconnect: true) */
	UnknownError = 4000,
	/** You sent an invalid Gateway opcode or an invalid payload for an opcode (Reconnect: true) */
	UnknownOpcode = 4001,
	/** You sent an invalid payload to Discord (Reconnect: true) */
	DecodeError = 4002,
	/** You sent us a payload prior to identifying, or this session has been invalidated (Reconnect: true) */
	NotAuthenticated = 4003,
	/** The account token sent with your identify payload is incorrect (Reconnect: false) */
	AuthenticationFailed = 4004,
	/** You sent more than one identify payload (Reconnect: true) */
	AlreadyAuthenticated = 4005,
	/** The sequence sent when resuming the session was invalid. Reconnect and start a new session (Reconnect: true) */
	InvalidSeq = 4007,
	/** You're sending payloads to us too quickly. Slow it down! (Reconnect: true) */
	RateLimited = 4008,
	/** Your session timed out. Reconnect and start a new one (Reconnect: true) */
	SessionTimedOut = 4009,
	/** You sent us an invalid shard when identifying (Reconnect: false) */
	InvalidShard = 4010,
	/** The session would have handled too many guilds - you are required to shard your connection (Reconnect: false) */
	ShardingRequired = 4011,
	/** You sent an invalid version for the gateway (Reconnect: false) */
	InvalidApiVersion = 4012,
	/** You sent an invalid intent for a Gateway Intent. You may have incorrectly calculated the bitwise value (Reconnect: false) */
	InvalidIntents = 4013,
	/** You sent a disallowed intent for a Gateway Intent. You may have tried to specify an intent that you have not enabled or are not approved for (Reconnect: false) */
	DisallowedIntents = 4014,
}

/**
 * Voice gateway opcodes.
 * Voice gateways have their own set of opcodes.
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#voice-voice-opcodes}
 */
export enum VoiceOpcode {
	/** Begin a voice websocket connection (Client) */
	Identify = 0,
	/** Select the voice protocol (Client) */
	SelectProtocol = 1,
	/** Complete the websocket handshake (Server) */
	Ready = 2,
	/** Keep the websocket connection alive (Client) */
	Heartbeat = 3,
	/** Describe the session (Server) */
	SessionDescription = 4,
	/** Indicate which users are speaking (Client and Server) */
	Speaking = 5,
	/** Sent to acknowledge a received client heartbeat (Server) */
	HeartbeatAck = 6,
	/** Resume a connection (Client) */
	Resume = 7,
	/** Time to wait between sending heartbeats in milliseconds (Server) */
	Hello = 8,
	/** Acknowledge a successful session resume (Server) */
	Resumed = 9,
	/** One or more clients have connected to the voice channel (Server) */
	ClientsConnect = 11,
	/** A client has disconnected from the voice channel (Server) */
	ClientDisconnect = 13,
	/** A downgrade from the DAVE protocol is upcoming (Server) */
	DavePrepareTransition = 21,
	/** Execute a previously announced protocol transition (Server) */
	DaveExecuteTransition = 22,
	/** Acknowledge readiness previously announced transition (Client) */
	DaveTransitionReady = 23,
	/** A DAVE protocol version or group change is upcoming (Server) */
	DavePrepareEpoch = 24,
	/** Credential and public key for MLS external sender (Server, Binary) */
	DaveMlsExternalSender = 25,
	/** MLS Key Package for pending group member (Client, Binary) */
	DaveMlsKeyPackage = 26,
	/** MLS Proposals to be appended or revoked (Server, Binary) */
	DaveMlsProposals = 27,
	/** MLS Commit with optional MLS Welcome messages (Client, Binary) */
	DaveMlsCommitWelcome = 28,
	/** MLS Commit to be processed for upcoming transition (Server, Binary) */
	DaveMlsAnnounceCommitTransition = 29,
	/** MLS Welcome to group for upcoming transition (Server, Binary) */
	DaveMlsWelcome = 30,
	/** Flag invalid commit or welcome, request re-add (Client) */
	DaveMlsInvalidCommitWelcome = 31,
}

/**
 * Voice gateway close event codes.
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#voice-voice-close-event-codes}
 */
export enum VoiceCloseCode {
	/** You sent an invalid opcode */
	UnknownOpcode = 4001,
	/** You sent an invalid payload in your identifying to the Gateway */
	FailedToDecodePayload = 4002,
	/** You sent a payload before identifying with the Gateway */
	NotAuthenticated = 4003,
	/** The token you sent in your identify payload is incorrect */
	AuthenticationFailed = 4004,
	/** You sent more than one identify payload */
	AlreadyAuthenticated = 4005,
	/** Your session is no longer valid */
	SessionNoLongerValid = 4006,
	/** Your session has timed out */
	SessionTimeout = 4009,
	/** We can't find the server you're trying to connect to */
	ServerNotFound = 4011,
	/** We didn't recognize the protocol you sent */
	UnknownProtocol = 4012,
	/** Disconnect individual client (you were kicked, the main gateway session was dropped, etc.). Should not reconnect */
	Disconnected = 4014,
	/** The server crashed. Try resuming */
	VoiceServerCrashed = 4015,
	/** We didn't recognize your encryption */
	UnknownEncryptionMode = 4016,
	/** You sent a malformed request */
	BadRequest = 4020,
	/** Disconnect due to rate limit exceeded. Should not reconnect */
	DisconnectedRateLimited = 4021,
	/** Disconnect all clients due to call terminated (channel deleted, voice server changed, etc.). Should not reconnect */
	DisconnectedCallTerminated = 4022,
}

/**
 * HTTP response codes returned by the Discord API.
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#http-http-response-codes}
 */
export enum HttpResponseCode {
	/** The request completed successfully */
	Ok = 200,
	/** The entity was created successfully */
	Created = 201,
	/** The request completed successfully but returned no content */
	NoContent = 204,
	/** The entity was not modified (no action was taken) */
	NotModified = 304,
	/** The request was improperly formatted, or the server couldn't understand it */
	BadRequest = 400,
	/** The Authorization header was missing or invalid */
	Unauthorized = 401,
	/** The Authorization token you passed did not have permission to the resource */
	Forbidden = 403,
	/** The resource at the location specified doesn't exist */
	NotFound = 404,
	/** The HTTP method used is not valid for the location specified */
	MethodNotAllowed = 405,
	/** You are being rate limited */
	TooManyRequests = 429,
	/** There was not a gateway available to process your request. Wait a bit and retry */
	GatewayUnavailable = 502,
}

/**
 * JSON error codes returned by the Discord API.
 * Along with the HTTP error code, the API can return more detailed error codes through
 * a `code` key in the JSON error response.
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#json-json-error-codes}
 */
export enum JsonErrorCode {
	/** General error (such as a malformed request body, amongst other things) */
	GeneralError = 0,
	/** Unknown account */
	UnknownAccount = 10001,
	/** Unknown application */
	UnknownApplication = 10002,
	/** Unknown channel */
	UnknownChannel = 10003,
	/** Unknown guild */
	UnknownGuild = 10004,
	/** Unknown integration */
	UnknownIntegration = 10005,
	/** Unknown invite */
	UnknownInvite = 10006,
	/** Unknown member */
	UnknownMember = 10007,
	/** Unknown message */
	UnknownMessage = 10008,
	/** Unknown permission overwrite */
	UnknownPermissionOverwrite = 10009,
	/** Unknown provider */
	UnknownProvider = 10010,
	/** Unknown role */
	UnknownRole = 10011,
	/** Unknown token */
	UnknownToken = 10012,
	/** Unknown user */
	UnknownUser = 10013,
	/** Unknown emoji */
	UnknownEmoji = 10014,
	/** Unknown webhook */
	UnknownWebhook = 10015,
	/** Unknown webhook service */
	UnknownWebhookService = 10016,
	/** Unknown session */
	UnknownSession = 10020,
	/** Unknown asset */
	UnknownAsset = 10021,
	/** Unknown ban */
	UnknownBan = 10026,
	/** Unknown SKU */
	UnknownSku = 10027,
	/** Unknown Store Listing */
	UnknownStoreListing = 10028,
	/** Unknown entitlement */
	UnknownEntitlement = 10029,
	/** Unknown build */
	UnknownBuild = 10030,
	/** Unknown lobby */
	UnknownLobby = 10031,
	/** Unknown branch */
	UnknownBranch = 10032,
	/** Unknown store directory layout */
	UnknownStoreDirectoryLayout = 10033,
	/** Unknown redistributable */
	UnknownRedistributable = 10036,
	/** Unknown gift code */
	UnknownGiftCode = 10038,
	/** Unknown stream */
	UnknownStream = 10049,
	/** Unknown premium server subscribe cooldown */
	UnknownPremiumServerSubscribeCooldown = 10050,
	/** Unknown guild template */
	UnknownGuildTemplate = 10057,
	/** Unknown discoverable server category */
	UnknownDiscoverableServerCategory = 10059,
	/** Unknown sticker */
	UnknownSticker = 10060,
	/** Unknown sticker pack */
	UnknownStickerPack = 10061,
	/** Unknown interaction */
	UnknownInteraction = 10062,
	/** Unknown application command */
	UnknownApplicationCommand = 10063,
	/** Unknown voice state */
	UnknownVoiceState = 10065,
	/** Unknown application command permissions */
	UnknownApplicationCommandPermissions = 10066,
	/** Unknown Stage Instance */
	UnknownStageInstance = 10067,
	/** Unknown Guild Member Verification Form */
	UnknownGuildMemberVerificationForm = 10068,
	/** Unknown Guild Welcome Screen */
	UnknownGuildWelcomeScreen = 10069,
	/** Unknown Guild Scheduled Event */
	UnknownGuildScheduledEvent = 10070,
	/** Unknown Guild Scheduled Event User */
	UnknownGuildScheduledEventUser = 10071,
	/** Unknown Tag */
	UnknownTag = 10087,
	/** Unknown sound */
	UnknownSound = 10097,
	/** Bots cannot use this endpoint */
	BotsCannotUseThisEndpoint = 20001,
	/** Only bots can use this endpoint */
	OnlyBotsCanUseThisEndpoint = 20002,
	/** Explicit content cannot be sent to the desired recipient(s) */
	ExplicitContentCannotBeSent = 20009,
	/** You are not authorized to perform this action on this application */
	NotAuthorizedToPerformActionOnApplication = 20012,
	/** This action cannot be performed due to slowmode rate limit */
	SlowmodeRateLimit = 20016,
	/** Only the owner of this account can perform this action */
	OnlyOwnerCanPerformAction = 20018,
	/** This message cannot be edited due to announcement rate limits */
	AnnouncementEditRateLimit = 20022,
	/** Under minimum age */
	UnderMinimumAge = 20024,
	/** The channel you are writing has hit the write rate limit */
	ChannelWriteRateLimit = 20028,
	/** The write action you are performing on the server has hit the write rate limit */
	ServerWriteRateLimit = 20029,
	/** Your Stage topic, server name, server description, or channel names contain words that are not allowed */
	DisallowedWords = 20031,
	/** Guild premium subscription level too low */
	GuildPremiumSubscriptionLevelTooLow = 20035,
	/** Maximum number of guilds reached (100) */
	MaxGuildsReached = 30001,
	/** Maximum number of friends reached (1000) */
	MaxFriendsReached = 30002,
	/** Maximum number of pins reached for the channel (50) */
	MaxPinsReached = 30003,
	/** Maximum number of recipients reached (10) */
	MaxRecipientsReached = 30004,
	/** Maximum number of guild roles reached (250) */
	MaxGuildRolesReached = 30005,
	/** Maximum number of webhooks reached (15) */
	MaxWebhooksReached = 30007,
	/** Maximum number of emojis reached */
	MaxEmojisReached = 30008,
	/** Maximum number of reactions reached (20) */
	MaxReactionsReached = 30010,
	/** Maximum number of group DMs reached (10) */
	MaxGroupDmsReached = 30011,
	/** Maximum number of guild channels reached (500) */
	MaxGuildChannelsReached = 30013,
	/** Maximum number of attachments in a message reached (10) */
	MaxAttachmentsReached = 30015,
	/** Maximum number of invites reached (1000) */
	MaxInvitesReached = 30016,
	/** Maximum number of animated emojis reached */
	MaxAnimatedEmojisReached = 30018,
	/** Maximum number of server members reached */
	MaxServerMembersReached = 30019,
	/** Maximum number of server categories has been reached (5) */
	MaxServerCategoriesReached = 30030,
	/** Guild already has a template */
	GuildAlreadyHasTemplate = 30031,
	/** Maximum number of application commands reached */
	MaxApplicationCommandsReached = 30032,
	/** Maximum number of thread participants has been reached (1000) */
	MaxThreadParticipantsReached = 30033,
	/** Maximum number of daily application command creates has been reached (200) */
	MaxDailyApplicationCommandCreatesReached = 30034,
	/** Maximum number of bans for non-guild members have been exceeded */
	MaxBansForNonGuildMembersExceeded = 30035,
	/** Maximum number of bans fetches has been reached */
	MaxBansFetchesReached = 30037,
	/** Maximum number of uncompleted guild scheduled events reached (100) */
	MaxUncompletedGuildScheduledEventsReached = 30038,
	/** Maximum number of stickers reached */
	MaxStickersReached = 30039,
	/** Maximum number of prune requests has been reached. Try again later */
	MaxPruneRequestsReached = 30040,
	/** Maximum number of guild widget settings updates has been reached. Try again later */
	MaxGuildWidgetSettingsUpdatesReached = 30042,
	/** Maximum number of soundboard sounds reached */
	MaxSoundboardSoundsReached = 30045,
	/** Maximum number of edits to messages older than 1 hour reached. Try again later */
	MaxEditsToOldMessagesReached = 30046,
	/** Maximum number of pinned threads in a forum channel has been reached */
	MaxPinnedThreadsInForumReached = 30047,
	/** Maximum number of tags in a forum channel has been reached */
	MaxTagsInForumReached = 30048,
	/** Bitrate is too high for channel of this type */
	BitrateTooHigh = 30052,
	/** Maximum number of premium emojis reached (25) */
	MaxPremiumEmojisReached = 30056,
	/** Maximum number of webhooks per guild reached (1000) */
	MaxWebhooksPerGuildReached = 30058,
	/** Maximum number of channel permission overwrites reached (1000) */
	MaxChannelPermissionOverwritesReached = 30060,
	/** The channels for this guild are too large */
	ChannelsForGuildAreTooLarge = 30061,
	/** Unauthorized. Provide a valid token and try again */
	Unauthorized = 40001,
	/** You need to verify your account in order to perform this action */
	VerifyYourAccount = 40002,
	/** You are opening direct messages too fast */
	OpeningDirectMessagesTooFast = 40003,
	/** Send messages has been temporarily disabled */
	SendMessagesTemporarilyDisabled = 40004,
	/** Request entity too large. Try sending something smaller in size */
	RequestEntityTooLarge = 40005,
	/** This feature has been temporarily disabled server-side */
	FeatureTemporarilyDisabled = 40006,
	/** The user is banned from this guild */
	UserBannedFromGuild = 40007,
	/** Connection has been revoked */
	ConnectionRevoked = 40012,
	/** Only consumable SKUs can be consumed */
	OnlyConsumableSkusCanBeConsumed = 40018,
	/** You can only delete sandbox entitlements */
	CanOnlyDeleteSandboxEntitlements = 40019,
	/** Target user is not connected to voice */
	TargetUserNotConnectedToVoice = 40032,
	/** This message has already been crossposted */
	MessageAlreadyCrossposted = 40033,
	/** An application command with that name already exists */
	ApplicationCommandWithNameAlreadyExists = 40041,
	/** Application interaction failed to send */
	ApplicationInteractionFailedToSend = 40043,
	/** Cannot send a message in a forum channel */
	CannotSendMessageInForumChannel = 40058,
	/** Interaction has already been acknowledged */
	InteractionAlreadyAcknowledged = 40060,
	/** Tag names must be unique */
	TagNamesMustBeUnique = 40061,
	/** Service resource is being rate limited */
	ServiceResourceRateLimited = 40062,
	/** There are no tags available that can be set by non-moderators */
	NoTagsAvailableForNonModerators = 40066,
	/** A tag is required to create a forum post in this channel */
	TagRequiredForForumPost = 40067,
	/** An entitlement has already been granted for this resource */
	EntitlementAlreadyGranted = 40074,
	/** This interaction has hit the maximum number of follow up messages */
	MaxFollowUpMessagesReached = 40094,
	/** Cloudflare is blocking your request. This can often be resolved by setting a proper User Agent */
	CloudflareBlocking = 40333,
	/** Missing access */
	MissingAccess = 50001,
	/** Invalid account type */
	InvalidAccountType = 50002,
	/** Cannot execute action on a DM channel */
	CannotExecuteOnDmChannel = 50003,
	/** Guild widget disabled */
	GuildWidgetDisabled = 50004,
	/** Cannot edit a message authored by another user */
	CannotEditMessageByAnotherUser = 50005,
	/** Cannot send an empty message */
	CannotSendEmptyMessage = 50006,
	/** Cannot send messages to this user */
	CannotSendMessagesToUser = 50007,
	/** Cannot send messages in a non-text channel */
	CannotSendMessagesInNonTextChannel = 50008,
	/** Channel verification level is too high for you to gain access */
	ChannelVerificationLevelTooHigh = 50009,
	/** OAuth2 application does not have a bot */
	OAuth2ApplicationDoesNotHaveBot = 50010,
	/** OAuth2 application limit reached */
	OAuth2ApplicationLimitReached = 50011,
	/** Invalid OAuth2 state */
	InvalidOAuth2State = 50012,
	/** You lack permissions to perform that action */
	MissingPermissions = 50013,
	/** Invalid authentication token provided */
	InvalidAuthenticationToken = 50014,
	/** Note was too long */
	NoteTooLong = 50015,
	/** Provided too few or too many messages to delete. Must provide at least 2 and fewer than 100 messages to delete */
	InvalidMessageDeleteCount = 50016,
	/** Invalid MFA Level */
	InvalidMfaLevel = 50017,
	/** A message can only be pinned to the channel it was sent in */
	MessageCanOnlyBePinnedToOriginChannel = 50019,
	/** Invite code was either invalid or taken */
	InviteCodeInvalidOrTaken = 50020,
	/** Cannot execute action on a system message */
	CannotExecuteOnSystemMessage = 50021,
	/** Cannot execute action on this channel type */
	CannotExecuteOnChannelType = 50024,
	/** Invalid OAuth2 access token provided */
	InvalidOAuth2AccessToken = 50025,
	/** Missing required OAuth2 scope */
	MissingOAuth2Scope = 50026,
	/** Invalid webhook token provided */
	InvalidWebhookToken = 50027,
	/** Invalid role */
	InvalidRole = 50028,
	/** Invalid Recipient(s) */
	InvalidRecipients = 50033,
	/** A message provided was too old to bulk delete */
	MessageTooOldToBulkDelete = 50034,
	/** Invalid form body (returned for both application/json and multipart/form-data bodies), or invalid Content-Type provided */
	InvalidFormBody = 50035,
	/** An invite was accepted to a guild the application's bot is not in */
	InviteAcceptedToGuildBotNotIn = 50036,
	/** Invalid Activity Action */
	InvalidActivityAction = 50039,
	/** Invalid API version provided */
	InvalidApiVersion = 50041,
	/** File uploaded exceeds the maximum size */
	FileUploadExceedsMaximumSize = 50045,
	/** Invalid file uploaded */
	InvalidFileUploaded = 50046,
	/** Cannot self-redeem this gift */
	CannotSelfRedeemGift = 50054,
	/** Invalid Guild */
	InvalidGuild = 50055,
	/** Invalid SKU */
	InvalidSku = 50057,
	/** Invalid request origin */
	InvalidRequestOrigin = 50067,
	/** Invalid message type */
	InvalidMessageType = 50068,
	/** Payment source required */
	PaymentSourceRequired = 50070,
	/** Cannot modify a system webhook */
	CannotModifySystemWebhook = 50073,
	/** Cannot delete a channel required for Community guilds */
	CannotDeleteCommunityRequiredChannel = 50074,
	/** Cannot edit stickers within a message */
	CannotEditStickersInMessage = 50080,
	/** Invalid sticker sent */
	InvalidStickerSent = 50081,
	/** Cannot perform operation on an archived thread */
	CannotOperateOnArchivedThread = 50083,
	/** Invalid thread notification settings */
	InvalidThreadNotificationSettings = 50084,
	/** `before` value is earlier than the thread creation date */
	BeforeValueEarlierThanThreadCreation = 50085,
	/** Community server channels must be text channels */
	CommunityServerChannelsMustBeText = 50086,
	/** The entity type of the event is different from the entity you are trying to start the event for */
	EventEntityTypeMismatch = 50091,
	/** This server is not available in your location */
	ServerNotAvailableInLocation = 50095,
	/** This server needs monetization enabled in order to perform this action */
	MonetizationRequired = 50097,
	/** This server needs more boosts to perform this action */
	MoreBoostsRequired = 50101,
	/** Invalid JSON in request body */
	InvalidJson = 50109,
	/** Invalid file provided */
	InvalidFile = 50110,
	/** Invalid file type */
	InvalidFileType = 50123,
	/** File duration exceeds maximum of 1 second */
	FileDurationExceedsMaximum = 50124,
	/** Ownership cannot be transferred to a bot user */
	OwnerCannotBePendingMember = 50131,
	/** Ownership cannot be transferred to a bot user */
	OwnershipCannotBeTransferredToBot = 50132,
	/** Failed to resize asset below the maximum size: 262144 */
	FailedToResizeAsset = 50138,
	/** Cannot mix subscription and non subscription roles for an emoji */
	CannotMixSubscriptionAndNonSubscriptionRoles = 50144,
	/** Cannot convert between premium emoji and normal emoji */
	CannotConvertBetweenPremiumAndNormalEmoji = 50145,
	/** Uploaded file not found */
	UploadedFileNotFound = 50146,
	/** Invalid emoji */
	InvalidEmoji = 50151,
	/** Voice messages do not support additional content */
	VoiceMessagesDoNotSupportAdditionalContent = 50159,
	/** Voice messages must have a single audio attachment */
	VoiceMessagesMustHaveSingleAudioAttachment = 50160,
	/** Voice messages must have supporting metadata */
	VoiceMessagesMustHaveSupportingMetadata = 50161,
	/** Voice messages cannot be edited */
	VoiceMessagesCannotBeEdited = 50162,
	/** Cannot delete guild subscription integration */
	CannotDeleteGuildSubscriptionIntegration = 50163,
	/** You cannot send voice messages in this channel */
	CannotSendVoiceMessagesInChannel = 50173,
	/** The user account must first be verified */
	UserAccountMustBeVerified = 50178,
	/** Invalid file duration */
	InvalidFileDuration = 50192,
	/** You do not have permission to send this sticker */
	NoPermissionToSendSticker = 50600,
	/** Two factor is required for this operation */
	TwoFactorRequired = 60003,
	/** No users with DiscordTag exist */
	NoUsersWithDiscordTag = 80004,
	/** Reaction was blocked */
	ReactionBlocked = 90001,
	/** User cannot use burst reactions */
	UserCannotUseBurstReactions = 90002,
	/** Application not yet available. Try again later */
	ApplicationNotYetAvailable = 110001,
	/** API resource is currently overloaded. Try again a little later */
	ApiResourceOverloaded = 130000,
	/** The Stage is already open */
	StageAlreadyOpen = 150006,
	/** Cannot reply without permission to read message history */
	CannotReplyWithoutReadMessageHistory = 160002,
	/** A thread has already been created for this message */
	ThreadAlreadyCreatedForMessage = 160004,
	/** Thread is locked */
	ThreadLocked = 160005,
	/** Maximum number of active threads reached */
	MaxActiveThreadsReached = 160006,
	/** Maximum number of active announcement threads reached */
	MaxActiveAnnouncementThreadsReached = 160007,
	/** Invalid JSON for uploaded Lottie file */
	InvalidLottieJson = 170001,
	/** Uploaded Lotties cannot contain rasterized images such as PNG or JPEG */
	LottiesCannotContainRasterizedImages = 170002,
	/** Sticker maximum framerate exceeded */
	StickerMaxFramerateExceeded = 170003,
	/** Sticker frame count exceeds maximum of 1000 frames */
	StickerFrameCountExceedsMaximum = 170004,
	/** Lottie animation maximum dimensions exceeded */
	LottieMaxDimensionsExceeded = 170005,
	/** Sticker frame rate is either too small or too large */
	StickerFrameRateOutOfRange = 170006,
	/** Sticker animation duration exceeds maximum of 5 seconds */
	StickerAnimationDurationExceedsMaximum = 170007,
	/** Cannot update a finished event */
	CannotUpdateFinishedEvent = 180000,
	/** Failed to create stage needed for stage event */
	FailedToCreateStageForStageEvent = 180002,
	/** Message was blocked by automatic moderation */
	MessageBlockedByAutoModeration = 200000,
	/** Title was blocked by automatic moderation */
	TitleBlockedByAutoModeration = 200001,
	/** Webhooks posted to forum channels must have a thread_name or thread_id */
	WebhooksInForumMustHaveThreadNameOrId = 220001,
	/** Webhooks posted to forum channels cannot have both a thread_name and thread_id */
	WebhooksInForumCannotHaveBothThreadNameAndId = 220002,
	/** Webhooks can only create threads in forum channels */
	WebhooksCanOnlyCreateThreadsInForum = 220003,
	/** Webhook services cannot be used in forum channels */
	WebhookServicesCannotBeUsedInForum = 220004,
	/** Message blocked by harmful links filter */
	MessageBlockedByHarmfulLinksFilter = 240000,
	/** Cannot enable onboarding, requirements are not met */
	CannotEnableOnboarding = 350000,
	/** Cannot update onboarding while below requirements */
	CannotUpdateOnboardingBelowRequirements = 350001,
	/** Your file upload has been limited for this guild */
	FileUploadLimitedForGuild = 400001,
	/** Failed to ban users */
	FailedToBanUsers = 500000,
	/** Poll voting was blocked */
	PollVotingBlocked = 520000,
	/** Poll expired */
	PollExpired = 520001,
	/** Invalid channel type for poll creation */
	InvalidChannelTypeForPollCreation = 520002,
	/** Cannot edit a poll message */
	CannotEditPollMessage = 520003,
	/** Cannot use an emoji included with the poll */
	CannotUseEmojiIncludedWithPoll = 520004,
	/** Cannot expire a non-poll message */
	CannotExpireNonPollMessage = 520006,
	/** OAuth2 linked role for provisional account is not granted */
	ProvisionalAccountsNotGranted = 530000,
	/** The id_token JWT has expired */
	IdTokenJwtExpired = 530001,
	/** The id_token issuer is not consistent */
	IdTokenIssuerMismatch = 530002,
	/** The id_token aud/azp is not the expected value */
	IdTokenAudienceMismatch = 530003,
	/** The id_token was issued too far in the past */
	IdTokenIssuedTooLongAgo = 530004,
	/** Failed to generate a unique username, please try again */
	FailedToGenerateUniqueUsername = 530006,
	/** Invalid client_secret */
	InvalidClientSecret = 530007,
}

/**
 * RPC error codes for the Discord RPC API.
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#rpc-rpc-error-codes}
 */
export enum RpcErrorCode {
	/** An unknown error occurred */
	UnknownError = 1000,
	/** You sent an invalid payload */
	InvalidPayload = 4000,
	/** Invalid command */
	InvalidCommand = 4002,
	/** Invalid guild */
	InvalidGuild = 4003,
	/** Invalid event */
	InvalidEvent = 4004,
	/** Invalid channel */
	InvalidChannel = 4005,
	/** Invalid permissions */
	InvalidPermissions = 4006,
	/** Invalid client ID */
	InvalidClientId = 4007,
	/** Invalid origin */
	InvalidOrigin = 4008,
	/** Invalid token */
	InvalidToken = 4009,
	/** Invalid user */
	InvalidUser = 4010,
	/** OAuth2 error */
	OAuth2Error = 5000,
	/** Select channel timed out */
	SelectChannelTimedOut = 5001,
	/** Get guild timed out */
	GetGuildTimedOut = 5002,
	/** Select voice force required */
	SelectVoiceForceRequired = 5003,
	/** Capture shortcut already listening */
	CaptureShortcutAlreadyListening = 5004,
}

/**
 * RPC close event codes for the Discord RPC API.
 * @see {@link https://discord.com/developers/docs/topics/opcodes-and-status-codes#rpc-rpc-close-event-codes}
 */
export enum RpcCloseCode {
	/** Invalid client ID */
	InvalidClientId = 4000,
	/** Invalid origin */
	InvalidOrigin = 4001,
	/** Rate limited */
	RateLimited = 4002,
	/** Token revoked */
	TokenRevoked = 4003,
	/** Invalid version */
	InvalidVersion = 4004,
	/** Invalid encoding */
	InvalidEncoding = 4005,
}
