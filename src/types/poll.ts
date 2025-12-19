import type { Emoji } from "./emoji.js";
import type { User } from "./user.js";

export enum PollLayoutType {
	Default = 1,
}

export interface PollMedia {
	text?: string;
	emoji?: Partial<Emoji>;
}

export interface PollAnswer {
	answer_id?: number;
	poll_media: PollMedia;
}

export interface PollAnswerCount {
	id: number;
	count: number;
	me_voted: boolean;
}

export interface PollResults {
	is_finalized: boolean;
	answer_counts: PollAnswerCount[];
}

export interface Poll {
	question: PollMedia;
	answers: PollAnswer[];
	expiry: string | null;
	allow_multiselect: boolean;
	layout_type: PollLayoutType;
	results?: PollResults;
}

export interface PollCreateRequest {
	question: PollMedia;
	answers: PollAnswer[];
	duration?: number;
	allow_multiselect?: boolean;
	layout_type?: PollLayoutType;
}

export interface GetAnswerVotersParams {
	after?: string;
	limit?: number;
}

export interface GetAnswerVotersResponse {
	users: User[];
}
