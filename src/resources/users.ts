import type { Rest } from "../rest/client.js";
import type { Channel } from "./channels.js";
import type { Guild, GuildMember, Integration } from "./guilds.js";
import type { PaginationWithCountParams } from "./utils.js";

/**
 * Flags that can be applied to a user's account.
 * @see {@link https://discord.com/developers/docs/resources/user#user-object-user-flags}
 */
export enum UserFlags {
	/** Discord Employee */
	Staff = 1 << 0,
	/** Partnered Server Owner */
	Partner = 1 << 1,
	/** HypeSquad Events Member */
	Hypesquad = 1 << 2,
	/** Bug Hunter Level 1 */
	BugHunterLevel1 = 1 << 3,
	/** House Bravery Member */
	HypesquadOnlineHouse1 = 1 << 6,
	/** House Brilliance Member */
	HypesquadOnlineHouse2 = 1 << 7,
	/** House Balance Member */
	HypesquadOnlineHouse3 = 1 << 8,
	/** Early Nitro Supporter */
	PremiumEarlySupporter = 1 << 9,
	/** User is a team */
	TeamPseudoUser = 1 << 10,
	/** Bug Hunter Level 2 */
	BugHunterLevel2 = 1 << 14,
	/** Verified Bot */
	VerifiedBot = 1 << 16,
	/** Early Verified Bot Developer */
	VerifiedDeveloper = 1 << 17,
	/** Moderator Programs Alumni */
	CertifiedModerator = 1 << 18,
	/** Bot uses only HTTP interactions and is shown in the online member list */
	BotHttpInteractions = 1 << 19,
	/** User is an Active Developer */
	ActiveDeveloper = 1 << 22,
}

/**
 * Premium (Nitro) subscription types.
 * @see {@link https://discord.com/developers/docs/resources/user#user-object-premium-types}
 */
export enum PremiumType {
	/** No Nitro subscription */
	None = 0,
	/** Nitro Classic subscription */
	NitroClassic = 1,
	/** Nitro subscription */
	Nitro = 2,
	/** Nitro Basic subscription */
	NitroBasic = 3,
}

/**
 * Third-party services that can be connected to a Discord account.
 * @see {@link https://discord.com/developers/docs/resources/user#connection-object-services}
 */
export enum ConnectionService {
	AmazonMusic = "amazon-music",
	Battlenet = "battlenet",
	Bungie = "bungie",
	Bluesky = "bluesky",
	Crunchyroll = "crunchyroll",
	Domain = "domain",
	Ebay = "ebay",
	EpicGames = "epicgames",
	Facebook = "facebook",
	GitHub = "github",
	/** @deprecated Service can no longer be added by users */
	Instagram = "instagram",
	LeagueOfLegends = "leagueoflegends",
	Mastodon = "mastodon",
	PayPal = "paypal",
	PlayStation = "playstation",
	Reddit = "reddit",
	RiotGames = "riotgames",
	Roblox = "roblox",
	Spotify = "spotify",
	/** @deprecated Service can no longer be added by users */
	Skype = "skype",
	Steam = "steam",
	TikTok = "tiktok",
	Twitch = "twitch",
	Twitter = "twitter",
	Xbox = "xbox",
	YouTube = "youtube",
}

/**
 * Visibility types for user connections.
 * @see {@link https://discord.com/developers/docs/resources/user#connection-object-visibility-types}
 */
export enum ConnectionVisibility {
	/** Invisible to everyone except the user themselves */
	None = 0,
	/** Visible to everyone */
	Everyone = 1,
}

/**
 * Background color palettes for nameplates.
 * @see {@link https://discord.com/developers/docs/resources/user#nameplate-nameplate-structure}
 */
export enum NameplatePalette {
	Crimson = "crimson",
	Berry = "berry",
	Sky = "sky",
	Teal = "teal",
	Forest = "forest",
	BubbleGum = "bubble_gum",
	Violet = "violet",
	Cobalt = "cobalt",
	Clover = "clover",
	Lemon = "lemon",
	White = "white",
}

/**
 * Data for a user's avatar decoration.
 * @see {@link https://discord.com/developers/docs/resources/user#avatar-decoration-data-object}
 */
export interface AvatarDecorationData {
	/** The avatar decoration hash */
	asset: string;
	/** ID of the avatar decoration's SKU */
	sku_id: string;
}

/**
 * Nameplate collectible data.
 * @see {@link https://discord.com/developers/docs/resources/user#nameplate-nameplate-structure}
 */
export interface Nameplate {
	/** ID of the nameplate SKU */
	sku_id: string;
	/** Path to the nameplate asset */
	asset: string;
	/** The label of this nameplate (currently unused) */
	label: string;
	/** Background color of the nameplate */
	palette: NameplatePalette;
}

/**
 * Collectibles the user has, excluding Avatar Decorations and Profile Effects.
 * @see {@link https://discord.com/developers/docs/resources/user#collectibles}
 */
export interface Collectibles {
	/** The user's nameplate, if any */
	nameplate?: Nameplate;
}

/**
 * The user's primary guild information.
 * @see {@link https://discord.com/developers/docs/resources/user#user-object-user-primary-guild}
 */
export interface UserPrimaryGuild {
	/** The ID of the user's primary guild */
	identity_guild_id: string | null;
	/** Whether the user is displaying the primary guild's server tag */
	identity_enabled: boolean | null;
	/** The text of the user's server tag (max 4 characters) */
	tag: string | null;
	/** The server tag badge hash */
	badge: string | null;
}

/**
 * Represents a Discord user.
 * @see {@link https://discord.com/developers/docs/resources/user#user-object}
 */
export interface User {
	/** The user's ID (snowflake) */
	id: string;
	/** The user's username, not unique across the platform */
	username: string;
	/** The user's Discord-tag (discriminator) */
	discriminator: string;
	/** The user's display name, if set. For bots, this is the application name */
	global_name: string | null;
	/** The user's avatar hash */
	avatar: string | null;
	/** Whether the user belongs to an OAuth2 application */
	bot?: boolean;
	/** Whether the user is an Official Discord System user */
	system?: boolean;
	/** Whether the user has two-factor authentication enabled */
	mfa_enabled?: boolean;
	/** The user's banner hash */
	banner?: string | null;
	/** The user's banner color as an integer representation of hex color code */
	accent_color?: number | null;
	/** The user's chosen language option */
	locale?: string;
	/** Whether the email on this account has been verified */
	verified?: boolean;
	/** The user's email */
	email?: string | null;
	/** The flags on the user's account */
	flags?: UserFlags;
	/** The type of Nitro subscription on the user's account */
	premium_type?: PremiumType;
	/** The public flags on the user's account */
	public_flags?: UserFlags;
	/** Data for the user's avatar decoration */
	avatar_decoration_data?: AvatarDecorationData | null;
	/** Data for the user's collectibles */
	collectibles?: Collectibles | null;
	/** The user's primary guild */
	primary_guild?: UserPrimaryGuild | null;
}

/**
 * Represents a connection that a user has attached to their account.
 * @see {@link https://discord.com/developers/docs/resources/user#connection-object}
 */
export interface Connection {
	/** ID of the connection account */
	id: string;
	/** The username of the connection account */
	name: string;
	/** The service of this connection */
	type: ConnectionService;
	/** Whether the connection is revoked */
	revoked?: boolean;
	/** An array of partial server integrations */
	integrations?: Partial<Integration>[];
	/** Whether the connection is verified */
	verified: boolean;
	/** Whether friend sync is enabled for this connection */
	friend_sync: boolean;
	/** Whether activities related to this connection will be shown in presence updates */
	show_activity: boolean;
	/** Whether this connection has a corresponding third party OAuth2 token */
	two_way_link: boolean;
	/** Visibility of this connection */
	visibility: ConnectionVisibility;
}

/**
 * The role connection that an application has attached to a user.
 * @see {@link https://discord.com/developers/docs/resources/user#application-role-connection-object}
 */
export interface ApplicationRoleConnection {
	/** The vanity name of the platform a bot has connected (max 50 characters) */
	platform_name: string | null;
	/** The username on the platform a bot has connected (max 100 characters) */
	platform_username: string | null;
	/** Object mapping application role connection metadata keys to their stringified value */
	metadata: Record<string, string>;
}

/**
 * Parameters for modifying the current user.
 * @see {@link https://discord.com/developers/docs/resources/user#modify-current-user-json-params}
 */
export type ModifyCurrentUserParams = Partial<Pick<User, "username" | "avatar" | "banner">>;

/**
 * Query parameters for getting the current user's guilds.
 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-guilds-query-string-params}
 */
export type GetCurrentUserGuildsParams = PaginationWithCountParams;

/**
 * Parameters for creating a DM channel.
 * @see {@link https://discord.com/developers/docs/resources/user#create-dm-json-params}
 */
export interface CreateDMParams {
	/** The recipient to open a DM channel with */
	recipient_id: string;
}

/**
 * Parameters for creating a group DM channel.
 * @see {@link https://discord.com/developers/docs/resources/user#create-group-dm-json-params}
 */
export interface CreateGroupDMParams {
	/** Access tokens of users that have granted your app the `gdm.join` scope */
	access_tokens: string[];
	/** A dictionary of user IDs to their respective nicknames */
	nicks: Record<string, string>;
}

/**
 * Parameters for updating the current user's application role connection.
 * @see {@link https://discord.com/developers/docs/resources/user#update-current-user-application-role-connection-json-params}
 */
export type UpdateApplicationRoleConnectionParams = Partial<{
	[K in keyof ApplicationRoleConnection]: NonNullable<ApplicationRoleConnection[K]>;
}>;

/**
 * API methods for interacting with Discord users.
 * @see {@link https://discord.com/developers/docs/resources/user}
 */
export class UsersAPI {
	private readonly rest: Rest;

	constructor(rest: Rest) {
		this.rest = rest;
	}

	/**
	 * Returns the user object of the requester's account.
	 * For OAuth2, this requires the `identify` scope.
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user}
	 */
	async getCurrentUser(): Promise<User> {
		return this.rest.get("/users/@me");
	}

	/**
	 * Returns a user object for a given user ID.
	 * @param userId - The ID of the user to fetch
	 * @see {@link https://discord.com/developers/docs/resources/user#get-user}
	 */
	async getUser(userId: string): Promise<User> {
		return this.rest.get(`/users/${userId}`);
	}

	/**
	 * Modify the requester's user account settings.
	 * Fires a User Update Gateway event.
	 * @param params - The parameters to modify
	 * @see {@link https://discord.com/developers/docs/resources/user#modify-current-user}
	 */
	async modifyCurrentUser(params: ModifyCurrentUserParams): Promise<User> {
		return this.rest.patch("/users/@me", { body: params });
	}

	/**
	 * Returns a list of partial guild objects the current user is a member of.
	 * For OAuth2, requires the `guilds` scope.
	 * @param params - Pagination parameters
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-guilds}
	 */
	async getCurrentUserGuilds(
		params: GetCurrentUserGuildsParams = {},
	): Promise<
		Pick<
			Guild,
			| "id"
			| "name"
			| "icon"
			| "banner"
			| "owner"
			| "permissions"
			| "features"
			| "approximate_member_count"
			| "approximate_presence_count"
		>[]
	> {
		return this.rest.get("/users/@me/guilds", { query: params });
	}

	/**
	 * Returns a guild member object for the current user.
	 * Requires the `guilds.members.read` OAuth2 scope.
	 * @param guildId - The ID of the guild
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-guild-member}
	 */
	async getCurrentUserGuildMember(guildId: string): Promise<GuildMember> {
		return this.rest.get(`/users/@me/guilds/${guildId}/member`);
	}

	/**
	 * Leave a guild.
	 * Fires a Guild Delete and Guild Member Remove Gateway event.
	 * @param guildId - The ID of the guild to leave
	 * @see {@link https://discord.com/developers/docs/resources/user#leave-guild}
	 */
	async leaveGuild(guildId: string): Promise<void> {
		return this.rest.delete(`/users/@me/guilds/${guildId}`);
	}

	/**
	 * Create a new DM channel with a user.
	 * Returns a DM channel object (if one already exists, it will be returned instead).
	 * @param params - The parameters containing the recipient ID
	 * @see {@link https://discord.com/developers/docs/resources/user#create-dm}
	 */
	async createDM(params: CreateDMParams): Promise<Channel> {
		return this.rest.post("/users/@me/channels", { body: params });
	}

	/**
	 * Create a new group DM channel with multiple users.
	 * This endpoint is limited to 10 active group DMs.
	 * Fires a Channel Create Gateway event.
	 * @param params - The parameters containing access tokens and nicknames
	 * @see {@link https://discord.com/developers/docs/resources/user#create-group-dm}
	 */
	async createGroupDM(params: CreateGroupDMParams): Promise<Channel> {
		return this.rest.post("/users/@me/channels", { body: params });
	}

	/**
	 * Returns a list of connection objects.
	 * Requires the `connections` OAuth2 scope.
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-connections}
	 */
	async getCurrentUserConnections(): Promise<Connection[]> {
		return this.rest.get("/users/@me/connections");
	}

	/**
	 * Returns the application role connection for the user.
	 * Requires an OAuth2 access token with `role_connections.write` scope.
	 * @param applicationId - The ID of the application
	 * @see {@link https://discord.com/developers/docs/resources/user#get-current-user-application-role-connection}
	 */
	async getCurrentUserApplicationRoleConnection(applicationId: string): Promise<ApplicationRoleConnection> {
		return this.rest.get(`/users/@me/applications/${applicationId}/role-connection`);
	}

	/**
	 * Updates and returns the application role connection for the user.
	 * Requires an OAuth2 access token with `role_connections.write` scope.
	 * @param applicationId - The ID of the application
	 * @param params - The parameters to update
	 * @see {@link https://discord.com/developers/docs/resources/user#update-current-user-application-role-connection}
	 */
	async updateCurrentUserApplicationRoleConnection(
		applicationId: string,
		params: UpdateApplicationRoleConnectionParams,
	): Promise<ApplicationRoleConnection> {
		return this.rest.put(`/users/@me/applications/${applicationId}/role-connection`, { body: params });
	}
}
