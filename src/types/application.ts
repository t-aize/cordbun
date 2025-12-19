import type { Guild } from "./guild.js";
import type { Team } from "./team.js";
import type { User } from "./user.js";

export enum ApplicationIntegrationType {
	GuildInstall = 0,
	UserInstall = 1,
}

export enum ApplicationEventWebhookStatus {
	Disabled = 1,
	Enabled = 2,
	DisabledByDiscord = 3,
}

export enum ApplicationFlags {
	ApplicationAutoModerationRuleCreateBadge = 1 << 6,
	GatewayPresence = 1 << 12,
	GatewayPresenceLimited = 1 << 13,
	GatewayGuildMembers = 1 << 14,
	GatewayGuildMembersLimited = 1 << 15,
	VerificationPendingGuildLimit = 1 << 16,
	Embedded = 1 << 17,
	GatewayMessageContent = 1 << 18,
	GatewayMessageContentLimited = 1 << 19,
	ApplicationCommandBadge = 1 << 23,
}

export enum ActivityLocationKind {
	GuildChannel = "gc",
	PrivateChannel = "pc",
}

export interface InstallParams {
	scopes: string[];
	permissions: string;
}

export interface ApplicationIntegrationTypeConfiguration {
	oauth2_install_params?: InstallParams;
}

export interface Application {
	id: string;
	name: string;
	icon: string | null;
	description: string;
	rpc_origins?: string[];
	bot_public: boolean;
	bot_require_code_grant: boolean;
	bot?: Partial<User>;
	terms_of_service_url?: string;
	privacy_policy_url?: string;
	owner?: Partial<User>;
	verify_key: string;
	team: Team | null;
	guild_id?: string;
	guild?: Partial<Guild>;
	primary_sku_id?: string;
	slug?: string;
	cover_image?: string;
	flags?: ApplicationFlags;
	approximate_guild_count?: number;
	approximate_user_install_count?: number;
	approximate_user_authorization_count?: number;
	redirect_uris?: string[];
	interactions_endpoint_url?: string | null;
	role_connections_verification_url?: string | null;
	event_webhooks_url?: string | null;
	event_webhooks_status: ApplicationEventWebhookStatus;
	event_webhooks_types?: string[];
	tags?: string[];
	install_params?: InstallParams;
	integration_types_config?: Record<
		string,
		ApplicationIntegrationTypeConfiguration
	>;
	custom_install_url?: string;
}

export interface ActivityLocation {
	id: string;
	kind: ActivityLocationKind;
	channel_id: string;
	guild_id?: string | null;
}

export interface ActivityInstance {
	application_id: string;
	instance_id: string;
	launch_id: string;
	location: ActivityLocation;
	users: string[];
}

export interface EditCurrentApplicationParams {
	custom_install_url?: string;
	description?: string;
	role_connections_verification_url?: string;
	install_params?: InstallParams;
	integration_types_config?: Record<
		string,
		ApplicationIntegrationTypeConfiguration
	>;
	flags?: ApplicationFlags;
	icon?: string | null;
	cover_image?: string | null;
	interactions_endpoint_url?: string;
	tags?: string[];
	event_webhooks_url?: string;
	event_webhooks_status?: ApplicationEventWebhookStatus;
	event_webhooks_types?: string[];
}
