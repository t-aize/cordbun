import type { RateLimitData } from "./types.js";

export interface RestEvents {
	request: [RequestInfo];
	response: [ResponseInfo];
	rateLimited: [RateLimitInfo];
	invalidRequestWarning: [InvalidRequestInfo];
}

export interface RequestInfo {
	method: string;
	route: string;
	path: string;
}

export interface ResponseInfo {
	method: string;
	route: string;
	path: string;
	status: number;
	latency: number;
}

export interface RateLimitInfo {
	route: string;
	global: boolean;
	limit: number;
	remaining: number;
	retryAfter: number;
	scope?: RateLimitData["scope"];
}

export interface InvalidRequestInfo {
	count: number;
	remainingTime: number;
}
