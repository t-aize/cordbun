/**
 * A value that can be resolved to a bitfield.
 * Can be a raw value, an array of values, or a BitfieldValue object.
 */
export type BitfieldResolvable<T extends number | bigint = number | bigint> = T | T[] | BitfieldValue<T>;

/**
 * Represents a resolved bitfield value.
 */
export interface BitfieldValue<T extends number | bigint = number | bigint> {
	/** The bitfield value */
	value: T;
}

/**
 * Checks if a value is a bigint.
 * @param value - The value to check
 * @returns True if the value is a bigint
 */
const isBigInt = (value: number | bigint): value is bigint => typeof value === "bigint";

/**
 * Returns zero in the same type as the reference value.
 * @param ref - Reference value to determine type
 * @returns Zero as the same type
 */
const zero = <T extends number | bigint>(ref: T): T => (isBigInt(ref) ? (0n as T) : (0 as T));

/**
 * Returns one in the same type as the reference value.
 * @param ref - Reference value to determine type
 * @returns One as the same type
 */
const one = <T extends number | bigint>(ref: T): T => (isBigInt(ref) ? (1n as T) : (1 as T));

/**
 * Resolves a BitfieldResolvable to its raw value.
 * @param resolvable - The value to resolve
 * @param ref - Reference value for type inference
 * @returns The resolved bitfield value
 */
const resolve = <T extends number | bigint>(resolvable: BitfieldResolvable<T>, ref: T): T => {
	if (typeof resolvable === "number" || typeof resolvable === "bigint") {
		return resolvable as T;
	}
	if (Array.isArray(resolvable)) {
		return resolvable.reduce((acc, val) => (acc | val) as T, zero(ref));
	}
	return resolvable.value;
};

/**
 * Utilities for working with bitfields.
 * Bitfields are used throughout Discord's API for flags and permissions.
 */
export const Bitfield = {
	/**
	 * Creates a BitfieldValue from a resolvable.
	 * @param value - The value to wrap
	 * @param ref - Reference value for type inference
	 * @returns A BitfieldValue object
	 */
	create: <T extends number | bigint>(value: BitfieldResolvable<T>, ref: T): BitfieldValue<T> => ({
		value: resolve(value, ref),
	}),

	/**
	 * Checks if a bitfield has a specific flag.
	 * @param bitfield - The bitfield to check
	 * @param flag - The flag to check for
	 * @param ref - Reference value for type inference
	 * @returns True if the flag is set
	 */
	has: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flag: T, ref: T): boolean => {
		const value = resolve(bitfield, ref);
		return (value & flag) === flag;
	},

	/**
	 * Checks if a bitfield has any of the specified flags.
	 * @param bitfield - The bitfield to check
	 * @param flags - Array of flags to check for
	 * @param ref - Reference value for type inference
	 * @returns True if any flag is set
	 */
	hasAny: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flags: T[], ref: T): boolean => {
		const value = resolve(bitfield, ref);
		return flags.some((flag) => (value & flag) === flag);
	},

	/**
	 * Checks if a bitfield has all of the specified flags.
	 * @param bitfield - The bitfield to check
	 * @param flags - Array of flags to check for
	 * @param ref - Reference value for type inference
	 * @returns True if all flags are set
	 */
	hasAll: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flags: T[], ref: T): boolean => {
		const value = resolve(bitfield, ref);
		return flags.every((flag) => (value & flag) === flag);
	},

	/**
	 * Adds flags to a bitfield.
	 * @param bitfield - The bitfield to modify
	 * @param flags - The flags to add
	 * @param ref - Reference value for type inference
	 * @returns The new bitfield value
	 */
	add: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flags: BitfieldResolvable<T>, ref: T): T =>
		(resolve(bitfield, ref) | resolve(flags, ref)) as T,

	/**
	 * Removes flags from a bitfield.
	 * @param bitfield - The bitfield to modify
	 * @param flags - The flags to remove
	 * @param ref - Reference value for type inference
	 * @returns The new bitfield value
	 */
	remove: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flags: BitfieldResolvable<T>, ref: T): T =>
		(resolve(bitfield, ref) & ~resolve(flags, ref)) as T,

	/**
	 * Toggles a flag in a bitfield.
	 * @param bitfield - The bitfield to modify
	 * @param flag - The flag to toggle
	 * @param ref - Reference value for type inference
	 * @returns The new bitfield value
	 */
	toggle: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flag: T, ref: T): T =>
		(resolve(bitfield, ref) ^ flag) as T,

	/**
	 * Sets or unsets a flag in a bitfield.
	 * @param bitfield - The bitfield to modify
	 * @param flag - The flag to set/unset
	 * @param value - True to set, false to unset
	 * @param ref - Reference value for type inference
	 * @returns The new bitfield value
	 */
	set: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flag: T, value: boolean, ref: T): T =>
		value ? Bitfield.add(bitfield, flag, ref) : Bitfield.remove(bitfield, flag, ref),

	/**
	 * Converts a bitfield to an array of flag names.
	 * @param bitfield - The bitfield to convert
	 * @param flags - Object mapping flag names to values
	 * @param ref - Reference value for type inference
	 * @returns Array of flag names that are set
	 */
	toArray: <T extends number | bigint>(
		bitfield: BitfieldResolvable<T>,
		flags: Record<string, T>,
		ref: T,
	): string[] => {
		const value = resolve(bitfield, ref);
		return Object.entries(flags)
			.filter(([, flag]) => (value & flag) === flag && flag !== zero(ref))
			.map(([name]) => name);
	},

	/**
	 * Creates a bitfield from an array of flag names.
	 * @param names - Array of flag names
	 * @param flags - Object mapping flag names to values
	 * @param ref - Reference value for type inference
	 * @returns The combined bitfield value
	 */
	fromArray: <T extends number | bigint>(names: string[], flags: Record<string, T>, ref: T): T =>
		names.reduce((acc, name) => (flags[name] !== undefined ? ((acc | flags[name]) as T) : acc), zero(ref)),

	/**
	 * Checks if a bitfield is empty (zero).
	 * @param bitfield - The bitfield to check
	 * @param ref - Reference value for type inference
	 * @returns True if the bitfield is zero
	 */
	isEmpty: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, ref: T): boolean =>
		resolve(bitfield, ref) === zero(ref),

	/**
	 * Checks if two bitfields are equal.
	 * @param a - First bitfield
	 * @param b - Second bitfield
	 * @param ref - Reference value for type inference
	 * @returns True if the bitfields are equal
	 */
	equals: <T extends number | bigint>(a: BitfieldResolvable<T>, b: BitfieldResolvable<T>, ref: T): boolean =>
		resolve(a, ref) === resolve(b, ref),

	/**
	 * Returns the intersection of two bitfields (flags present in both).
	 * @param a - First bitfield
	 * @param b - Second bitfield
	 * @param ref - Reference value for type inference
	 * @returns The intersection bitfield
	 */
	intersection: <T extends number | bigint>(a: BitfieldResolvable<T>, b: BitfieldResolvable<T>, ref: T): T =>
		(resolve(a, ref) & resolve(b, ref)) as T,

	/**
	 * Returns the difference of two bitfields (flags in a but not in b).
	 * @param a - First bitfield
	 * @param b - Second bitfield
	 * @param ref - Reference value for type inference
	 * @returns The difference bitfield
	 */
	difference: <T extends number | bigint>(a: BitfieldResolvable<T>, b: BitfieldResolvable<T>, ref: T): T =>
		(resolve(a, ref) & ~resolve(b, ref)) as T,

	/**
	 * Returns the complement of a bitfield (all flags not in the bitfield).
	 * @param bitfield - The bitfield to complement
	 * @param all - The bitfield with all possible flags set
	 * @param ref - Reference value for type inference
	 * @returns The complement bitfield
	 */
	complement: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, all: T, ref: T): T =>
		(all & ~resolve(bitfield, ref)) as T,

	/**
	 * Counts the number of set bits in a bitfield.
	 * @param bitfield - The bitfield to count
	 * @param ref - Reference value for type inference
	 * @returns The number of set bits
	 */
	count: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, ref: T): number => {
		let value = resolve(bitfield, ref);
		let c = 0;
		const oneVal = one(ref);
		while (value > zero(ref)) {
			if ((value & oneVal) === oneVal) c++;
			value = (isBigInt(value) ? value >> 1n : value >> 1) as T;
		}
		return c;
	},

	/**
	 * Serializes a bitfield to a string.
	 * @param bitfield - The bitfield to serialize
	 * @param ref - Reference value for type inference
	 * @returns The bitfield as a string
	 */
	serialize: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, ref: T): string =>
		resolve(bitfield, ref).toString(),

	/**
	 * Parses a string into a bitfield value.
	 * @param value - The string to parse
	 * @param ref - Reference value for type inference
	 * @returns The parsed bitfield value
	 */
	parse: <T extends number | bigint>(value: string, ref: T): T =>
		(isBigInt(ref) ? BigInt(value) : Number.parseInt(value, 10)) as T,
} as const;
