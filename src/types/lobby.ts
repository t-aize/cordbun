import type { Channel } from "./channel.js";

export enum LobbyMemberFlags {
	CanLinkLobby = 1 << 0,
}

export interface LobbyMember {
	id: string;
	metadata?: Record<string, string> | null;
	flags?: LobbyMemberFlags;
}

export interface Lobby {
	id: string;
	application_id: string;
	metadata: Record<string, string> | null;
	members: LobbyMember[];
	linked_channel?: Channel;
}

export interface CreateLobbyParams {
	metadata?: Record<string, string> | null;
	members?: LobbyMember[];
	idle_timeout_seconds?: number;
}

export interface ModifyLobbyParams {
	metadata?: Record<string, string> | null;
	members?: LobbyMember[];
	idle_timeout_seconds?: number;
}

export interface AddLobbyMemberParams {
	metadata?: Record<string, string> | null;
	flags?: LobbyMemberFlags;
}

export interface LinkChannelToLobbyParams {
	channel_id?: string;
}
