import type { ApiVersion, JsonErrorCode } from "../constants/index.js";
import type { ApiErrorResponse } from "../resources/errors.js";

/**
 * HTTP methods supported by the REST client.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * A route path starting with a forward slash.
 * @example "/users/@me"
 * @example "/guilds/123456789"
 */
export type RouteLike = `/${string}`;

/**
 * Authorization types for Discord API requests.
 * - `Bot`: Used for bot tokens
 * - `Bearer`: Used for OAuth2 access tokens
 */
export type AuthType = "Bot" | "Bearer";

/**
 * Configuration options for the REST client.
 */
export interface RESTOptions {
	/** The type of authorization to use (default: "Bot") */
	authType?: AuthType;
	/** The Discord API version to use (default: 10) */
	version?: ApiVersion;
	/** Custom User-Agent header value */
	userAgent?: string;
	/** Number of retry attempts for failed requests (default: 3) */
	retries?: number;
	/** Request timeout in milliseconds (default: 15000) */
	timeout?: number;
	/** Interval in ms to emit invalid request warnings (default: 0, disabled) */
	invalidRequestWarningInterval?: number;
	/** Interval in ms to sweep expired rate limit buckets (default: 300000) */
	sweepInterval?: number;
}

/**
 * Possible values for query string parameters.
 */
export type QueryValue = string | number | boolean | undefined;

/**
 * Possible values for request body content.
 */
export type BodyValue = string | Buffer | ArrayBuffer | Uint8Array | object;

/**
 * Options for individual REST requests.
 */
export interface RequestOptions {
	/** The request body */
	body?: BodyValue;
	/** Files to upload with the request */
	files?: FileData[];
	/** Query string parameters */
	query?: { [key: string]: QueryValue };
	/** Audit log reason (X-Audit-Log-Reason header) */
	reason?: string;
	/** Whether to include authorization header (default: true) */
	auth?: boolean;
	/** Additional headers to include */
	headers?: Record<string, string>;
}

/**
 * Data for a file to be uploaded.
 */
export interface FileData {
	/** The name of the file */
	name: string;
	/** The file content */
	data: Blob | ArrayBuffer | Uint8Array;
	/** The MIME type of the file */
	contentType?: string;
}

/**
 * Rate limit information from Discord API response headers.
 * @see {@link https://discord.com/developers/docs/topics/rate-limits#header-format}
 */
export interface RateLimitData {
	/** The number of requests that can be made */
	limit: number;
	/** The number of remaining requests that can be made */
	remaining: number;
	/** Epoch time (seconds) at which the rate limit resets */
	reset: number;
	/** Total time (in seconds) until the rate limit resets */
	resetAfter: number;
	/** A unique string denoting the rate limit being encountered */
	bucket: string;
	/** Whether this is a global rate limit */
	global: boolean;
	/** The scope of the rate limit */
	scope?: RateLimitScope | undefined;
}

/**
 * The scope of a rate limit.
 * - `user`: Per bot or user limit
 * - `global`: Per bot or user global limit
 * - `shared`: Per resource limit
 * @see {@link https://discord.com/developers/docs/topics/rate-limits#header-format}
 */
export type RateLimitScope = "user" | "global" | "shared";

/**
 * Response body when a rate limit is exceeded.
 * @see {@link https://discord.com/developers/docs/topics/rate-limits#rate-limit-response-structure}
 */
export interface RateLimitResponse {
	/** A message saying you are being rate limited */
	message: string;
	/** The number of seconds to wait before submitting another request */
	retry_after: number;
	/** Whether this is a global rate limit */
	global: boolean;
	/** An error code for some limits */
	code?: JsonErrorCode;
}

/**
 * The response object returned by REST requests.
 * @typeParam T - The type of data returned
 */
export interface RESTResponse<T> {
	/** The response data */
	data: T;
	/** The HTTP status code */
	status: number;
	/** The response headers */
	headers: Headers;
	/** Rate limit information, if present */
	rateLimit: RateLimitData | null;
}

/**
 * Error thrown when the Discord API returns an error response.
 */
export class RESTError extends Error {
	constructor(
		/** The HTTP status code */
		public readonly status: number,
		/** The Discord API error code */
		public readonly code: JsonErrorCode,
		message: string,
		/** Detailed error information for form validation errors */
		public readonly errors?: ApiErrorResponse["errors"],
		/** Rate limit information if the error was rate limit related */
		public readonly rateLimit?: RateLimitData,
	) {
		super(message);
		this.name = "RESTError";
	}

	/**
	 * Creates a RESTError from a Discord API error response.
	 * @param response - The error response from the API
	 * @param status - The HTTP status code
	 * @param rateLimit - Rate limit data if present
	 */
	static fromResponse(response: ApiErrorResponse, status: number, rateLimit?: RateLimitData): RESTError {
		return new RESTError(status, response.code, response.message, response.errors, rateLimit);
	}
}

/**
 * Error thrown when a rate limit is exceeded.
 * @see {@link https://discord.com/developers/docs/topics/rate-limits#exceeding-a-rate-limit}
 */
export class RateLimitError extends Error {
	constructor(
		/** The number of seconds to wait before retrying */
		public readonly retryAfter: number,
		/** Whether this is a global rate limit */
		public readonly global: boolean,
		/** The scope of the rate limit */
		public readonly scope?: RateLimitScope,
	) {
		super(`Rate limited for ${retryAfter}s${global ? " (global)" : ""}`);
		this.name = "RateLimitError";
	}
}

/**
 * Error thrown when Cloudflare blocks the request.
 * This typically occurs when too many invalid requests are made.
 * @see {@link https://discord.com/developers/docs/topics/rate-limits#invalid-request-limit-aka-cloudflare-bans}
 */
export class CloudflareError extends Error {
	constructor(
		/** The HTTP status code returned by Cloudflare */
		public readonly status: number,
	) {
		super(`Cloudflare error: ${status}`);
		this.name = "CloudflareError";
	}
}

/**
 * Error thrown when a file exceeds the maximum upload size.
 */
export class FileTooLargeError extends Error {
	constructor(
		/** The name of the file */
		public readonly fileName: string,
		/** The actual size of the file in bytes */
		public readonly size: number,
		/** The maximum allowed size in bytes */
		public readonly maxSize: number,
	) {
		super(
			`File "${fileName}" exceeds max size: ${(size / 1024 / 1024).toFixed(2)} MiB > ${maxSize / 1024 / 1024} MiB`,
		);
		this.name = "FileTooLargeError";
	}
}

/**
 * Internal representation of a rate limit bucket.
 */
export interface RateLimitBucket {
	/** The number of requests that can be made */
	limit: number;
	/** The number of remaining requests */
	remaining: number;
	/** Epoch time (milliseconds) at which the rate limit resets */
	reset: number;
}

/**
 * Error thrown when a request times out.
 */
export class TimeoutError extends Error {
	constructor(
		/** The timeout duration in milliseconds */
		public readonly timeout: number,
	) {
		super(`Request timed out after ${timeout}ms`);
		this.name = "TimeoutError";
	}
}
