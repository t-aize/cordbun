/**
 * Base URL for the Discord REST API.
 * @see {@link https://discord.com/developers/docs/reference#api-reference-base-url}
 */
export const API_BASE_URL = "https://discord.com/api";

/**
 * Discord Epoch timestamp in milliseconds (first second of 2015).
 * Used for generating and parsing snowflake IDs.
 * @see {@link https://discord.com/developers/docs/reference#snowflakes}
 */
export const DISCORD_EPOCH = 1420070400000n;

/**
 * Discord API versions.
 * You should specify which version to use by including it in the request path
 * like `https://discord.com/api/v{version_number}`.
 * @see {@link https://discord.com/developers/docs/reference#api-versioning}
 */
export enum ApiVersion {
	/** @deprecated API v6 is deprecated */
	V6 = 6,
	/** @deprecated API v7 is deprecated */
	V7 = 7,
	/** @deprecated API v8 is deprecated */
	V8 = 8,
	/** API version 9 */
	V9 = 9,
	/** API version 10 (recommended) */
	V10 = 10,
}
