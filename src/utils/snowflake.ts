import { DISCORD_EPOCH } from "../constants/index.js";

export type Snowflake = `${bigint}`;

export interface DeconstructedSnowflake {
	id: bigint;
	timestamp: bigint;
	workerId: bigint;
	processId: bigint;
	increment: bigint;
	date: Date;
}

const toBigInt = (snowflake: Snowflake | bigint): bigint =>
	typeof snowflake === "bigint" ? snowflake : BigInt(snowflake);

export const Snowflake = {
	getTimestamp: (snowflake: Snowflake | bigint): bigint => (toBigInt(snowflake) >> 22n) + DISCORD_EPOCH,

	getWorkerId: (snowflake: Snowflake | bigint): bigint => (toBigInt(snowflake) & 0x3e0000n) >> 17n,

	getProcessId: (snowflake: Snowflake | bigint): bigint => (toBigInt(snowflake) & 0x1f000n) >> 12n,

	getIncrement: (snowflake: Snowflake | bigint): bigint => toBigInt(snowflake) & 0xfffn,

	getDate: (snowflake: Snowflake | bigint): Date => new Date(Number(Snowflake.getTimestamp(snowflake))),

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

	fromTimestamp: (timestamp: number | Date): Snowflake => {
		const ms = timestamp instanceof Date ? timestamp.getTime() : timestamp;
		return `${(BigInt(ms) - DISCORD_EPOCH) << 22n}`;
	},

	isValid: (value: string): value is Snowflake => {
		if (!/^\d{17,20}$/.test(value)) return false;
		try {
			const id = BigInt(value);
			return id >= 0n && id <= 0xffffffffffffffffn;
		} catch {
			return false;
		}
	},

	compare: (a: Snowflake | bigint, b: Snowflake | bigint): -1 | 0 | 1 => {
		const bigA = toBigInt(a);
		const bigB = toBigInt(b);
		if (bigA < bigB) return -1;
		if (bigA > bigB) return 1;
		return 0;
	},

	isOlderThan: (snowflake: Snowflake | bigint, other: Snowflake | bigint): boolean =>
		Snowflake.compare(snowflake, other) < 0,

	isNewerThan: (snowflake: Snowflake | bigint, other: Snowflake | bigint): boolean =>
		Snowflake.compare(snowflake, other) > 0,

	timestampFrom: (snowflake: Snowflake | bigint): number => Number(Snowflake.getTimestamp(snowflake)),
} as const;
