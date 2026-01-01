import { DISCORD_EPOCH } from "../constants/index.js";

/**
 * A Discord snowflake ID represented as a string.
 * Snowflakes are unique identifiers using Twitter's snowflake format.
 * @see {@link https://discord.com/developers/docs/reference#snowflakes}
 */
export type Snowflake = `${bigint}`;

/**
 * A deconstructed snowflake with all its components.
 * @see {@link https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right}
 */
export interface DeconstructedSnowflake {
	/** The full snowflake ID as a bigint */
	id: bigint;
	/** Milliseconds since Discord Epoch (first second of 2015) */
	timestamp: bigint;
	/** Internal worker ID (5 bits) */
	workerId: bigint;
	/** Internal process ID (5 bits) */
	processId: bigint;
	/** Increment value for IDs generated on the same process (12 bits) */
	increment: bigint;
	/** JavaScript Date object representing the snowflake's creation time */
	date: Date;
}

/**
 * Converts a snowflake to bigint if it isn't already.
 * @param snowflake - The snowflake to convert
 * @returns The snowflake as a bigint
 */
const toBigInt = (snowflake: Snowflake | bigint): bigint =>
	typeof snowflake === "bigint" ? snowflake : BigInt(snowflake);

/**
 * Utilities for working with Discord snowflake IDs.
 * Discord uses Twitter's snowflake format for uniquely identifiable descriptors (IDs).
 * These IDs are guaranteed to be unique across all of Discord.
 * @see {@link https://discord.com/developers/docs/reference#snowflakes}
 */
export const Snowflake = {
	/**
	 * Extracts the timestamp from a snowflake.
	 * @param snowflake - The snowflake to extract the timestamp from
	 * @returns The timestamp in milliseconds since Unix epoch
	 */
	getTimestamp: (snowflake: Snowflake | bigint): bigint => (toBigInt(snowflake) >> 22n) + DISCORD_EPOCH,

	/**
	 * Extracts the internal worker ID from a snowflake.
	 * @param snowflake - The snowflake to extract the worker ID from
	 * @returns The worker ID (5 bits)
	 */
	getWorkerId: (snowflake: Snowflake | bigint): bigint => (toBigInt(snowflake) & 0x3e0000n) >> 17n,

	/**
	 * Extracts the internal process ID from a snowflake.
	 * @param snowflake - The snowflake to extract the process ID from
	 * @returns The process ID (5 bits)
	 */
	getProcessId: (snowflake: Snowflake | bigint): bigint => (toBigInt(snowflake) & 0x1f000n) >> 12n,

	/**
	 * Extracts the increment from a snowflake.
	 * @param snowflake - The snowflake to extract the increment from
	 * @returns The increment value (12 bits)
	 */
	getIncrement: (snowflake: Snowflake | bigint): bigint => toBigInt(snowflake) & 0xfffn,

	/**
	 * Converts a snowflake to a JavaScript Date object.
	 * @param snowflake - The snowflake to convert
	 * @returns The Date representing when the snowflake was created
	 */
	getDate: (snowflake: Snowflake | bigint): Date => new Date(Number(Snowflake.getTimestamp(snowflake))),

	/**
	 * Deconstructs a snowflake into all its component parts.
	 * @param snowflake - The snowflake to deconstruct
	 * @returns An object containing all snowflake components
	 */
	deconstruct: (snowflake: Snowflake | bigint): DeconstructedSnowflake => {
		const id = toBigInt(snowflake);
		const timestamp = Snowflake.getTimestamp(id);
		return {
			id,
			timestamp,
			workerId: Snowflake.getWorkerId(id),
			processId: Snowflake.getProcessId(id),
			increment: Snowflake.getIncrement(id),
			date: new Date(Number(timestamp)),
		};
	},

	/**
	 * Generates a snowflake from a timestamp.
	 * Useful for pagination when you want results from a specific time.
	 * @param timestamp - The timestamp in milliseconds or a Date object
	 * @returns A snowflake representing that timestamp
	 * @see {@link https://discord.com/developers/docs/reference#snowflakes-snowflake-ids-in-pagination}
	 */
	fromTimestamp: (timestamp: number | Date): Snowflake => {
		const ms = timestamp instanceof Date ? timestamp.getTime() : timestamp;
		return `${(BigInt(ms) - DISCORD_EPOCH) << 22n}`;
	},

	/**
	 * Validates whether a string is a valid snowflake.
	 * @param value - The string to validate
	 * @returns True if the value is a valid snowflake
	 */
	isValid: (value: string): value is Snowflake => {
		if (!/^\d{17,20}$/.test(value)) return false;
		try {
			const id = BigInt(value);
			return id >= 0n && id <= 0xffffffffffffffffn;
		} catch {
			return false;
		}
	},

	/**
	 * Compares two snowflakes chronologically.
	 * @param a - First snowflake
	 * @param b - Second snowflake
	 * @returns -1 if a < b, 0 if equal, 1 if a > b
	 */
	compare: (a: Snowflake | bigint, b: Snowflake | bigint): -1 | 0 | 1 => {
		const bigA = toBigInt(a);
		const bigB = toBigInt(b);
		if (bigA < bigB) return -1;
		if (bigA > bigB) return 1;
		return 0;
	},

	/**
	 * Checks if a snowflake is older than another.
	 * @param snowflake - The snowflake to check
	 * @param other - The snowflake to compare against
	 * @returns True if snowflake is older than other
	 */
	isOlderThan: (snowflake: Snowflake | bigint, other: Snowflake | bigint): boolean =>
		Snowflake.compare(snowflake, other) < 0,

	/**
	 * Checks if a snowflake is newer than another.
	 * @param snowflake - The snowflake to check
	 * @param other - The snowflake to compare against
	 * @returns True if snowflake is newer than other
	 */
	isNewerThan: (snowflake: Snowflake | bigint, other: Snowflake | bigint): boolean =>
		Snowflake.compare(snowflake, other) > 0,

	/**
	 * Extracts the timestamp from a snowflake as a number.
	 * @param snowflake - The snowflake to extract the timestamp from
	 * @returns The timestamp in milliseconds since Unix epoch
	 */
	timestampFrom: (snowflake: Snowflake | bigint): number => Number(Snowflake.getTimestamp(snowflake)),
} as const;
