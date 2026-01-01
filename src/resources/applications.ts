import type { PermissionFlags } from "../constants/index.js";
import type { REST } from "../rest/index.js";
import type { Guild } from "./guilds.js";
import type { OAuth2Scope } from "./oauth2.js";
import type { Team } from "./teams.js";
import type { User } from "./users.js";

/**
 * Application integration types.
 * @see {@link https://discord.com/developers/docs/resources/application#application-object-application-integration-types}
 */
export enum ApplicationIntegrationType {
	/** App is installable to servers */
	GuildInstall = 0,
	/** App is installable to users */
	UserInstall = 1,
}

/**
 * Application event webhook status.
 * @see {@link https://discord.com/developers/docs/resources/application#application-object-application-event-webhook-status}
 */
export enum ApplicationEventWebhookStatus {
	/** Webhook events are disabled by developer */
	Disabled = 1,
	/** Webhook events are enabled by developer */
	Enabled = 2,
	/** Webhook events are disabled by Discord, usually due to inactivity */
	DisabledByDiscord = 3,
}

/**
 * Application flags.
 * @see {@link https://discord.com/developers/docs/resources/application#application-object-application-flags}
 */
export enum ApplicationFlags {
	/** Indicates if an app uses the Auto Moderation API */
	ApplicationAutoModerationRuleCreateBadge = 1 << 6,
	/** Intent required for bots in 100+ servers to receive presence_update events */
	GatewayPresence = 1 << 12,
	/** Intent required for bots in <100 servers to receive presence_update events */
	GatewayPresenceLimited = 1 << 13,
	/** Intent required for bots in 100+ servers to receive member-related events */
	GatewayGuildMembers = 1 << 14,
	/** Intent required for bots in <100 servers to receive member-related events */
	GatewayGuildMembersLimited = 1 << 15,
	/** Indicates unusual growth of an app that prevents verification */
	VerificationPendingGuildLimit = 1 << 16,
	/** Indicates if an app is embedded within the Discord client */
	Embedded = 1 << 17,
	/** Intent required for bots in 100+ servers to receive message content */
	GatewayMessageContent = 1 << 18,
	/** Intent required for bots in <100 servers to receive message content */
	GatewayMessageContentLimited = 1 << 19,
	/** Indicates if an app has registered global application commands */
	ApplicationCommandBadge = 1 << 23,
}

/**
 * Activity location kind.
 * @see {@link https://discord.com/developers/docs/resources/application#get-application-activity-instance-activity-location-kind-enum}
 */
export enum ActivityLocationKind {
	GuildChannel = "gc",
	PrivateChannel = "pc",
}

/**
 * Install params structure.
 * @see {@link https://discord.com/developers/docs/resources/application#install-params-object}
 */
export interface InstallParams {
	/** Scopes to add the application to the server with */
	scopes: OAuth2Scope[];
	/** Permissions to request for the bot role */
	permissions: `${PermissionFlags}`;
}

/**
 * Application integration type configuration.
 * @see {@link https://discord.com/developers/docs/resources/application#application-object-application-integration-type-configuration-object}
 */
export interface ApplicationIntegrationTypeConfiguration {
	/** Install params for each installation context's default in-app authorization link */
	oauth2_install_params?: InstallParams;
}

/**
 * Represents a Discord application.
 * @see {@link https://discord.com/developers/docs/resources/application#application-object}
 */
export interface Application {
	/** ID of the app */
	id: string;
	/** Name of the app */
	name: string;
	/** Icon hash of the app */
	icon: string | null;
	/** Description of the app */
	description: string;
	/** List of RPC origin URLs, if RPC is enabled */
	rpc_origins?: string[];
	/** When false, only the app owner can add the app to guilds */
	bot_public: boolean;
	/** When true, the app's bot will only join upon completion of the full OAuth2 code grant flow */
	bot_require_code_grant: boolean;
	/** Partial user object for the bot user associated with the app */
	bot?: Partial<User>;
	/** URL of the app's Terms of Service */
	terms_of_service_url?: string;
	/** URL of the app's Privacy Policy */
	privacy_policy_url?: string;
	/** Partial user object for the owner of the app */
	owner?: Partial<User>;
	/** Hex encoded key for verification in interactions */
	verify_key: string;
	/** If the app belongs to a team, this will be the team object */
	team: Team | null;
	/** Guild associated with the app */
	guild_id?: string;
	/** Partial object of the associated guild */
	guild?: Partial<Guild>;
	/** If this app is a game sold on Discord, this is the "Game SKU" ID */
	primary_sku_id?: string;
	/** If this app is a game sold on Discord, this is the URL slug */
	slug?: string;
	/** App's default rich presence invite cover image hash */
	cover_image?: string;
	/** App's public flags */
	flags?: ApplicationFlags;
	/** Approximate count of guilds the app has been added to */
	approximate_guild_count?: number;
	/** Approximate count of users that have installed the app */
	approximate_user_install_count?: number;
	/** Approximate count of users that have OAuth2 authorizations for the app */
	approximate_user_authorization_count?: number;
	/** Array of redirect URIs for the app */
	redirect_uris?: string[];
	/** Interactions endpoint URL for the app */
	interactions_endpoint_url?: string | null;
	/** Role connection verification URL for the app */
	role_connections_verification_url?: string | null;
	/** Event webhooks URL for the app */
	event_webhooks_url?: string | null;
	/** If webhook events are enabled for the app */
	event_webhooks_status: ApplicationEventWebhookStatus;
	/** List of Webhook event types the app subscribes to */
	event_webhooks_types?: string[];
	/** List of tags describing the content and functionality of the app */
	tags?: string[];
	/** Settings for the app's default in-app authorization link */
	install_params?: InstallParams;
	/** Default scopes and permissions for each supported installation context */
	integration_types_config?: Record<string, ApplicationIntegrationTypeConfiguration>;
	/** Default custom authorization URL for the app */
	custom_install_url?: string;
}

/**
 * Activity location object.
 * @see {@link https://discord.com/developers/docs/resources/application#get-application-activity-instance-activity-location-object}
 */
export interface ActivityLocation {
	/** Unique identifier for the location */
	id: string;
	/** Enum describing kind of location */
	kind: ActivityLocationKind;
	/** ID of the Channel */
	channel_id: string;
	/** ID of the Guild */
	guild_id?: string | null;
}

/**
 * Activity instance object.
 * @see {@link https://discord.com/developers/docs/resources/application#get-application-activity-instance-activity-instance-object}
 */
export interface ActivityInstance {
	/** Application ID */
	application_id: string;
	/** Activity Instance ID */
	instance_id: string;
	/** Unique identifier for the launch */
	launch_id: string;
	/** Location the instance is running in */
	location: ActivityLocation;
	/** IDs of the Users currently connected to the instance */
	users: string[];
}

/**
 * Parameters for editing the current application.
 * @see {@link https://discord.com/developers/docs/resources/application#edit-current-application-json-params}
 */
export type EditCurrentApplicationParams = Partial<
	Pick<
		Application,
		| "custom_install_url"
		| "description"
		| "role_connections_verification_url"
		| "install_params"
		| "integration_types_config"
		| "flags"
		| "icon"
		| "cover_image"
		| "interactions_endpoint_url"
		| "tags"
		| "event_webhooks_url"
		| "event_webhooks_status"
		| "event_webhooks_types"
	>
>;

/**
 * API methods for interacting with Discord applications.
 * @see {@link https://discord.com/developers/docs/resources/application}
 */
export class ApplicationsAPI {
	private readonly rest: REST;

	constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Returns the application object associated with the requesting bot user.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/application#get-current-application}
	 */
	async getCurrent(): Promise<Application> {
		return this.rest.get("/applications/@me");
	}

	/**
	 * Edit properties of the app associated with the requesting bot user.
	 *
	 * @param params - The parameters to modify
	 * @see {@link https://discord.com/developers/docs/resources/application#edit-current-application}
	 */
	async editCurrent(params: EditCurrentApplicationParams): Promise<Application> {
		return this.rest.patch("/applications/@me", { body: params });
	}

	/**
	 * Returns a serialized activity instance, if it exists.
	 *
	 * @param applicationId - The ID of the application
	 * @param instanceId - The ID of the activity instance
	 * @see {@link https://discord.com/developers/docs/resources/application#get-application-activity-instance}
	 */
	async getActivityInstance(applicationId: string, instanceId: string): Promise<ActivityInstance> {
		return this.rest.get(`/applications/${applicationId}/activity-instances/${instanceId}`);
	}
}
