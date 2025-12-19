import type { GuildMember } from "./guild.js";

export interface VoiceState {
	guild_id?: string;
	channel_id: string | null;
	user_id: string;
	member?: GuildMember;
	session_id: string;
	deaf: boolean;
	mute: boolean;
	self_deaf: boolean;
	self_mute: boolean;
	self_stream?: boolean;
	self_video: boolean;
	suppress: boolean;
	request_to_speak_timestamp: string | null;
}

export interface VoiceRegion {
	id: string;
	name: string;
	optimal: boolean;
	deprecated: boolean;
	custom: boolean;
}

export interface ModifyCurrentUserVoiceStateParams {
	channel_id?: string;
	suppress?: boolean;
	request_to_speak_timestamp?: string | null;
}

export interface ModifyUserVoiceStateParams {
	channel_id?: string;
	suppress?: boolean;
}
