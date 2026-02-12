import type { RateLimitScope } from "./types.js";

/**
 * Events emitted by the REST client.
 */
export interface RESTEvents {
	/** Emitted before a request is made */
	request: [RequestInfo];
	/** Emitted after a response is received */
	response: [ResponseInfo];
	/** Emitted when a rate limit is encountered */
	rateLimited: [RateLimitInfo];
	/** Emitted periodically when invalid requests are accumulating */
	invalidRequestWarning: [InvalidRequestInfo];
}

/**
 * Information about an outgoing request.
 */
export interface RequestInfo {
	/** The HTTP method used */
	method: string;
	/** The rate limit bucket key for this route */
	route: string;
	/** The full URL being requested */
	path: string;
}

/**
 * Information about a received response.
 */
export interface ResponseInfo {
	/** The HTTP method used */
	method: string;
	/** The rate limit bucket key for this route */
	route: string;
	/** The full URL that was requested */
	path: string;
	/** The HTTP status code */
	status: number;
	/** The request latency in milliseconds */
	latency: number;
}

/**
 * Information about an encountered rate limit.
 */
export interface RateLimitInfo {
	/** The rate limit bucket key for this route */
	route: string;
	/** Whether this is a global rate limit */
	global: boolean;
	/** The number of requests that can be made */
	limit: number;
	/** The number of remaining requests (always 0 when rate limited) */
	remaining: number;
	/** The number of seconds to wait before retrying */
	retryAfter: number;
	/** The scope of the rate limit */
	scope?: RateLimitScope;
}

/**
 * Information about accumulated invalid requests.
 * Invalid requests are 401, 403, or 429 responses.
 * @see {@link https://discord.com/developers/docs/topics/rate-limits#invalid-request-limit-aka-cloudflare-bans}
 */
export interface InvalidRequestInfo {
	/** The number of invalid requests in the current window */
	count: number;
	/** Time remaining in the current window (milliseconds) */
	remainingTime: number;
}
