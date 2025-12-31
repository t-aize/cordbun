import type { ApplicationIntegrationType } from "./applications.js";
import type { Channel, ChannelType } from "./channels.js";
import type { Component, ModalComponent } from "./components.js";
import type { Entitlement } from "./entitlements.js";
import type { Guild, GuildMember } from "./guilds.js";
import type { AllowedMentions, Attachment, Embed, Message } from "./messages.js";
import type { Poll } from "./polls.js";
import type { Role } from "./roles.js";
import type { User } from "./users.js";

export enum InteractionType {
	Ping = 1,
	ApplicationCommand = 2,
	MessageComponent = 3,
	ApplicationCommandAutocomplete = 4,
	ModalSubmit = 5,
}

export enum InteractionContextType {
	Guild = 0,
	BotDM = 1,
	PrivateChannel = 2,
}

export enum ApplicationCommandType {
	ChatInput = 1,
	User = 2,
	Message = 3,
	PrimaryEntryPoint = 4,
}

export enum ApplicationCommandOptionType {
	SubCommand = 1,
	SubCommandGroup = 2,
	String = 3,
	Integer = 4,
	Boolean = 5,
	User = 6,
	Channel = 7,
	Role = 8,
	Mentionable = 9,
	Number = 10,
	Attachment = 11,
}

export enum ApplicationCommandPermissionType {
	Role = 1,
	User = 2,
	Channel = 3,
}

export enum InteractionCallbackType {
	Pong = 1,
	ChannelMessageWithSource = 4,
	DeferredChannelMessageWithSource = 5,
	DeferredUpdateMessage = 6,
	UpdateMessage = 7,
	ApplicationCommandAutocompleteResult = 8,
	Modal = 9,
	PremiumRequired = 10,
	LaunchActivity = 12,
}

export enum EntryPointCommandHandlerType {
	AppHandler = 1,
	DiscordLaunchActivity = 2,
}

export interface ApplicationCommandOptionChoice {
	name: string;
	name_localizations?: Record<string, string> | null;
	value: string | number;
}

export interface ApplicationCommandOption {
	type: ApplicationCommandOptionType;
	name: string;
	name_localizations?: Record<string, string> | null;
	description: string;
	description_localizations?: Record<string, string> | null;
	required?: boolean;
	choices?: ApplicationCommandOptionChoice[];
	options?: ApplicationCommandOption[];
	channel_types?: ChannelType[];
	min_value?: number;
	max_value?: number;
	min_length?: number;
	max_length?: number;
	autocomplete?: boolean;
}

export interface ApplicationCommand {
	id: string;
	type?: ApplicationCommandType;
	application_id: string;
	guild_id?: string;
	name: string;
	name_localizations?: Record<string, string> | null;
	description: string;
	description_localizations?: Record<string, string> | null;
	options?: ApplicationCommandOption[];
	default_member_permissions: string | null;
	dm_permission?: boolean;
	default_permission?: boolean | null;
	nsfw?: boolean;
	integration_types?: ApplicationIntegrationType[];
	contexts?: InteractionContextType[] | null;
	version: string;
	handler?: EntryPointCommandHandlerType;
}

export interface ApplicationCommandPermission {
	id: string;
	type: ApplicationCommandPermissionType;
	permission: boolean;
}

export interface GuildApplicationCommandPermissions {
	id: string;
	application_id: string;
	guild_id: string;
	permissions: ApplicationCommandPermission[];
}

export interface ResolvedData {
	users?: Record<string, User>;
	members?: Record<string, Partial<GuildMember>>;
	roles?: Record<string, Role>;
	channels?: Record<string, Partial<Channel>>;
	messages?: Record<string, Partial<Message>>;
	attachments?: Record<string, Attachment>;
}

export interface ApplicationCommandInteractionDataOption {
	name: string;
	type: ApplicationCommandOptionType;
	value?: string | number | boolean;
	options?: ApplicationCommandInteractionDataOption[];
	focused?: boolean;
}

export interface ApplicationCommandData {
	id: string;
	name: string;
	type: ApplicationCommandType;
	resolved?: ResolvedData;
	options?: ApplicationCommandInteractionDataOption[];
	guild_id?: string;
	target_id?: string;
}

export interface MessageComponentData {
	custom_id: string;
	component_type: number;
	values?: string[];
	resolved?: ResolvedData;
}

export interface ModalSubmitData {
	custom_id: string;
	components: Component[];
	resolved?: ResolvedData;
}

export type InteractionData = ApplicationCommandData | MessageComponentData | ModalSubmitData;

export interface AuthorizingIntegrationOwners {
	"0"?: string;
	"1"?: string;
}

export interface Interaction {
	id: string;
	application_id: string;
	type: InteractionType;
	data?: InteractionData;
	guild?: Partial<Guild>;
	guild_id?: string;
	channel?: Partial<Channel>;
	channel_id?: string;
	member?: GuildMember;
	user?: User;
	token: string;
	version: number;
	message?: Message;
	app_permissions: string;
	locale?: string;
	guild_locale?: string;
	entitlements: Entitlement[];
	authorizing_integration_owners: AuthorizingIntegrationOwners;
	context?: InteractionContextType;
	attachment_size_limit: number;
}

export interface MessageInteraction {
	id: string;
	type: InteractionType;
	name: string;
	user: User;
	member?: Partial<GuildMember>;
}

export interface InteractionCallbackMessages {
	tts?: boolean;
	content?: string;
	embeds?: Embed[];
	allowed_mentions?: AllowedMentions;
	flags?: number;
	components?: Component[];
	attachments?: Partial<Attachment>[];
	poll?: Poll;
}

export interface InteractionCallbackAutocomplete {
	choices: ApplicationCommandOptionChoice[];
}

export interface InteractionCallbackModal {
	custom_id: string;
	title: string;
	components: ModalComponent[];
}

export type InteractionCallbackData =
	| InteractionCallbackMessages
	| InteractionCallbackAutocomplete
	| InteractionCallbackModal;

export interface InteractionResponse {
	type: InteractionCallbackType;
	data?: InteractionCallbackData;
}

export interface InteractionCallbackObject {
	id: string;
	type: InteractionType;
	activity_instance_id?: string;
	response_message_id?: string;
	response_message_loading?: boolean;
	response_message_ephemeral?: boolean;
}

export interface InteractionCallbackActivityInstanceResource {
	id: string;
}

export interface InteractionCallbackResource {
	type: InteractionCallbackType;
	activity_instance?: InteractionCallbackActivityInstanceResource;
	message?: Message;
}

export interface InteractionCallbackResponse {
	interaction: InteractionCallbackObject;
	resource?: InteractionCallbackResource;
}

export interface CreateGlobalApplicationCommandParams {
	name: string;
	name_localizations?: Record<string, string> | null;
	description?: string;
	description_localizations?: Record<string, string> | null;
	options?: ApplicationCommandOption[];
	default_member_permissions?: string | null;
	dm_permission?: boolean | null;
	default_permission?: boolean;
	integration_types?: ApplicationIntegrationType[];
	contexts?: InteractionContextType[];
	type?: ApplicationCommandType;
	nsfw?: boolean;
}

export interface EditGlobalApplicationCommandParams {
	name?: string;
	name_localizations?: Record<string, string> | null;
	description?: string;
	description_localizations?: Record<string, string> | null;
	options?: ApplicationCommandOption[];
	default_member_permissions?: string | null;
	dm_permission?: boolean | null;
	default_permission?: boolean;
	integration_types?: ApplicationIntegrationType[];
	contexts?: InteractionContextType[];
	nsfw?: boolean;
}

export interface CreateGuildApplicationCommandParams {
	name: string;
	name_localizations?: Record<string, string> | null;
	description?: string;
	description_localizations?: Record<string, string> | null;
	options?: ApplicationCommandOption[];
	default_member_permissions?: string | null;
	default_permission?: boolean;
	type?: ApplicationCommandType;
	nsfw?: boolean;
}

export interface EditGuildApplicationCommandParams {
	name?: string;
	name_localizations?: Record<string, string> | null;
	description?: string;
	description_localizations?: Record<string, string> | null;
	options?: ApplicationCommandOption[];
	default_member_permissions?: string | null;
	default_permission?: boolean;
	nsfw?: boolean;
}

export interface EditApplicationCommandPermissionsParams {
	permissions: ApplicationCommandPermission[];
}

export interface BulkOverwriteGuildApplicationCommandParams {
	id?: string;
	name: string;
	name_localizations?: Record<string, string> | null;
	description: string;
	description_localizations?: Record<string, string> | null;
	options?: ApplicationCommandOption[];
	default_member_permissions?: string | null;
	dm_permission?: boolean | null;
	default_permission?: boolean;
	integration_types?: ApplicationIntegrationType[];
	contexts?: InteractionContextType[];
	type?: ApplicationCommandType;
	nsfw?: boolean;
}
