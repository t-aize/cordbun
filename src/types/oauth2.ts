import type { Application } from "./application.js";
import type { Guild } from "./guild.js";
import type { User } from "./user.js";
import type { Webhook } from "./webhook.js";

export enum OAuth2Scope {
	ActivitiesRead = "activities.read",
	ActivitiesWrite = "activities.write",
	ApplicationsBuildsRead = "applications.builds.read",
	ApplicationsBuildsUpload = "applications.builds.upload",
	ApplicationsCommands = "applications.commands",
	ApplicationsCommandsUpdate = "applications.commands.update",
	ApplicationsCommandsPermissionsUpdate = "applications.commands.permissions.update",
	ApplicationsEntitlements = "applications.entitlements",
	ApplicationsStoreUpdate = "applications.store.update",
	Bot = "bot",
	Connections = "connections",
	DmChannelsRead = "dm_channels.read",
	Email = "email",
	GdmJoin = "gdm.join",
	Guilds = "guilds",
	GuildsJoin = "guilds.join",
	GuildsMembersRead = "guilds.members.read",
	Identify = "identify",
	MessagesRead = "messages.read",
	RelationshipsRead = "relationships.read",
	RoleConnectionsWrite = "role_connections.write",
	Rpc = "rpc",
	RpcActivitiesWrite = "rpc.activities.write",
	RpcNotificationsRead = "rpc.notifications.read",
	RpcVoiceRead = "rpc.voice.read",
	RpcVoiceWrite = "rpc.voice.write",
	Voice = "voice",
	WebhookIncoming = "webhook.incoming",
}

export interface AccessTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token?: string;
	scope: string;
}

export interface WebhookTokenResponse extends AccessTokenResponse {
	webhook: Webhook;
}

export interface BotAuthorizationTokenResponse extends AccessTokenResponse {
	guild: Guild;
}

export interface AuthorizationInfo {
	application: Partial<Application>;
	scopes: string[];
	expires: string;
	user?: User;
}

export interface TokenExchangeParams {
	grant_type: "authorization_code";
	code: string;
	redirect_uri: string;
}

export interface RefreshTokenParams {
	grant_type: "refresh_token";
	refresh_token: string;
}

export interface ClientCredentialsParams {
	grant_type: "client_credentials";
	scope?: string;
}

export interface RevokeTokenParams {
	token: string;
	token_type_hint?: "access_token" | "refresh_token";
}
