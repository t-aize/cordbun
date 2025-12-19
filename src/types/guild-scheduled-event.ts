import type { GuildMember } from "./guild.js";
import type { User } from "./user.js";

export enum GuildScheduledEventPrivacyLevel {
	GuildOnly = 2,
}

export enum GuildScheduledEventEntityType {
	StageInstance = 1,
	Voice = 2,
	External = 3,
}

export enum GuildScheduledEventStatus {
	Scheduled = 1,
	Active = 2,
	Completed = 3,
	Canceled = 4,
}

export enum GuildScheduledEventRecurrenceRuleFrequency {
	Yearly = 0,
	Monthly = 1,
	Weekly = 2,
	Daily = 3,
}

export enum GuildScheduledEventRecurrenceRuleWeekday {
	Monday = 0,
	Tuesday = 1,
	Wednesday = 2,
	Thursday = 3,
	Friday = 4,
	Saturday = 5,
	Sunday = 6,
}

export enum GuildScheduledEventRecurrenceRuleMonth {
	January = 1,
	February = 2,
	March = 3,
	April = 4,
	May = 5,
	June = 6,
	July = 7,
	August = 8,
	September = 9,
	October = 10,
	November = 11,
	December = 12,
}

export interface GuildScheduledEventEntityMetadata {
	location?: string;
}

export interface GuildScheduledEventRecurrenceRuleNWeekday {
	n: number;
	day: GuildScheduledEventRecurrenceRuleWeekday;
}

export interface GuildScheduledEventRecurrenceRule {
	start: string;
	end: string | null;
	frequency: GuildScheduledEventRecurrenceRuleFrequency;
	interval: number;
	by_weekday: GuildScheduledEventRecurrenceRuleWeekday[] | null;
	by_n_weekday: GuildScheduledEventRecurrenceRuleNWeekday[] | null;
	by_month: GuildScheduledEventRecurrenceRuleMonth[] | null;
	by_month_day: number[] | null;
	by_year_day: number[] | null;
	count: number | null;
}

export interface GuildScheduledEvent {
	id: string;
	guild_id: string;
	channel_id: string | null;
	creator_id?: string | null;
	name: string;
	description?: string | null;
	scheduled_start_time: string;
	scheduled_end_time: string | null;
	privacy_level: GuildScheduledEventPrivacyLevel;
	status: GuildScheduledEventStatus;
	entity_type: GuildScheduledEventEntityType;
	entity_id: string | null;
	entity_metadata: GuildScheduledEventEntityMetadata | null;
	creator?: User;
	user_count?: number;
	image?: string | null;
	recurrence_rule: GuildScheduledEventRecurrenceRule | null;
}

export interface GuildScheduledEventUser {
	guild_scheduled_event_id: string;
	user: User;
	member?: GuildMember;
}

export interface ListScheduledEventsParams {
	with_user_count?: boolean;
}

export interface CreateGuildScheduledEventParams {
	channel_id?: string;
	entity_metadata?: GuildScheduledEventEntityMetadata;
	name: string;
	privacy_level: GuildScheduledEventPrivacyLevel;
	scheduled_start_time: string;
	scheduled_end_time?: string;
	description?: string;
	entity_type: GuildScheduledEventEntityType;
	image?: string;
	recurrence_rule?: GuildScheduledEventRecurrenceRule;
}

export interface ModifyGuildScheduledEventParams {
	channel_id?: string | null;
	entity_metadata?: GuildScheduledEventEntityMetadata | null;
	name?: string;
	privacy_level?: GuildScheduledEventPrivacyLevel;
	scheduled_start_time?: string;
	scheduled_end_time?: string;
	description?: string | null;
	entity_type?: GuildScheduledEventEntityType;
	status?: GuildScheduledEventStatus;
	image?: string;
	recurrence_rule?: GuildScheduledEventRecurrenceRule | null;
}

export interface GetGuildScheduledEventUsersParams {
	limit?: number;
	with_member?: boolean;
	before?: string;
	after?: string;
}
