export enum StagePrivacyLevel {
	Public = 1,
	GuildOnly = 2,
}

export interface StageInstance {
	id: string;
	guild_id: string;
	channel_id: string;
	topic: string;
	privacy_level: StagePrivacyLevel;
	discoverable_disabled: boolean;
	guild_scheduled_event_id: string | null;
}

export interface CreateStageInstanceParams {
	channel_id: string;
	topic: string;
	privacy_level?: StagePrivacyLevel;
	send_start_notification?: boolean;
	guild_scheduled_event_id?: string;
}

export interface ModifyStageInstanceParams {
	topic?: string;
	privacy_level?: StagePrivacyLevel;
}
