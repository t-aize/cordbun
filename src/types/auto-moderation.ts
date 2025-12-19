export enum AutoModerationTriggerType {
	Keyword = 1,
	Spam = 3,
	KeywordPreset = 4,
	MentionSpam = 5,
	MemberProfile = 6,
}

export enum AutoModerationEventType {
	MessageSend = 1,
	MemberUpdate = 2,
}

export enum AutoModerationKeywordPresetType {
	Profanity = 1,
	SexualContent = 2,
	Slurs = 3,
}

export enum AutoModerationActionType {
	BlockMessage = 1,
	SendAlertMessage = 2,
	Timeout = 3,
	BlockMemberInteraction = 4,
}

export interface AutoModerationTriggerMetadata {
	keyword_filter?: string[];
	regex_patterns?: string[];
	presets?: AutoModerationKeywordPresetType[];
	allow_list?: string[];
	mention_total_limit?: number;
	mention_raid_protection_enabled?: boolean;
}

export interface AutoModerationActionMetadata {
	channel_id?: string;
	duration_seconds?: number;
	custom_message?: string;
}

export interface AutoModerationAction {
	type: AutoModerationActionType;
	metadata?: AutoModerationActionMetadata;
}

export interface AutoModerationRule {
	id: string;
	guild_id: string;
	name: string;
	creator_id: string;
	event_type: AutoModerationEventType;
	trigger_type: AutoModerationTriggerType;
	trigger_metadata: AutoModerationTriggerMetadata;
	actions: AutoModerationAction[];
	enabled: boolean;
	exempt_roles: string[];
	exempt_channels: string[];
}

export interface CreateAutoModerationRuleParams {
	name: string;
	event_type: AutoModerationEventType;
	trigger_type: AutoModerationTriggerType;
	trigger_metadata?: AutoModerationTriggerMetadata;
	actions: AutoModerationAction[];
	enabled?: boolean;
	exempt_roles?: string[];
	exempt_channels?: string[];
}

export interface ModifyAutoModerationRuleParams {
	name?: string;
	event_type?: AutoModerationEventType;
	trigger_metadata?: AutoModerationTriggerMetadata;
	actions?: AutoModerationAction[];
	enabled?: boolean;
	exempt_roles?: string[];
	exempt_channels?: string[];
}
