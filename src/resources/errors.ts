import type { JsonErrorCode } from "../constants/index.js";

/**
 * Represents a single error detail within an API error response.
 * @see {@link https://discord.com/developers/docs/reference#error-messages}
 */
export interface ApiErrorDetail {
	/** The error code identifier */
	code: string;
	/** Human-readable error message */
	message: string;
}

/**
 * Represents errors for a specific field in an API error response.
 * @see {@link https://discord.com/developers/docs/reference#error-messages}
 */
export interface ApiFieldError {
	/** Array of error details for this field */
	_errors: ApiErrorDetail[];
}

/**
 * Represents either a field error or nested errors within an API error response.
 * @see {@link https://discord.com/developers/docs/reference#error-messages}
 */
export type ApiErrorField = ApiFieldError | ApiNestedErrors;

/**
 * Represents nested errors within an API error response.
 * Keys can be field names or array indices.
 * @see {@link https://discord.com/developers/docs/reference#error-messages}
 */
export interface ApiNestedErrors {
	[key: string]: ApiErrorField;
}

/**
 * Represents the structure of an API error response from Discord.
 * Starting in API v8, Discord improved error formatting to indicate which JSON key
 * contains the error, the error code, and a human-readable error message.
 * @see {@link https://discord.com/developers/docs/reference#error-messages}
 */
export interface ApiErrorResponse {
	/** Discord JSON error code */
	code: JsonErrorCode;
	/** Human-readable error message */
	message: string;
	/** Nested errors indicating which fields caused the error */
	errors?: ApiNestedErrors;
}
