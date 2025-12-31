export type BitfieldResolvable<T extends number | bigint = number | bigint> = T | T[] | BitfieldValue<T>;

export interface BitfieldValue<T extends number | bigint = number | bigint> {
	value: T;
}

const isBigInt = (value: number | bigint): value is bigint => typeof value === "bigint";

const zero = <T extends number | bigint>(ref: T): T => (isBigInt(ref) ? (0n as T) : (0 as T));

const one = <T extends number | bigint>(ref: T): T => (isBigInt(ref) ? (1n as T) : (1 as T));

const resolve = <T extends number | bigint>(resolvable: BitfieldResolvable<T>, ref: T): T => {
	if (typeof resolvable === "number" || typeof resolvable === "bigint") {
		return resolvable as T;
	}
	if (Array.isArray(resolvable)) {
		return resolvable.reduce((acc, val) => (acc | val) as T, zero(ref));
	}
	return resolvable.value;
};

export const Bitfield = {
	create: <T extends number | bigint>(value: BitfieldResolvable<T>, ref: T): BitfieldValue<T> => ({
		value: resolve(value, ref),
	}),

	has: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flag: T, ref: T): boolean => {
		const value = resolve(bitfield, ref);
		return (value & flag) === flag;
	},

	hasAny: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flags: T[], ref: T): boolean => {
		const value = resolve(bitfield, ref);
		return flags.some((flag) => (value & flag) === flag);
	},

	hasAll: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flags: T[], ref: T): boolean => {
		const value = resolve(bitfield, ref);
		return flags.every((flag) => (value & flag) === flag);
	},

	add: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flags: BitfieldResolvable<T>, ref: T): T =>
		(resolve(bitfield, ref) | resolve(flags, ref)) as T,

	remove: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flags: BitfieldResolvable<T>, ref: T): T =>
		(resolve(bitfield, ref) & ~resolve(flags, ref)) as T,

	toggle: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flag: T, ref: T): T =>
		(resolve(bitfield, ref) ^ flag) as T,

	set: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, flag: T, value: boolean, ref: T): T =>
		value ? Bitfield.add(bitfield, flag, ref) : Bitfield.remove(bitfield, flag, ref),

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

	fromArray: <T extends number | bigint>(names: string[], flags: Record<string, T>, ref: T): T =>
		names.reduce((acc, name) => (flags[name] !== undefined ? ((acc | flags[name]) as T) : acc), zero(ref)),

	isEmpty: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, ref: T): boolean =>
		resolve(bitfield, ref) === zero(ref),

	equals: <T extends number | bigint>(a: BitfieldResolvable<T>, b: BitfieldResolvable<T>, ref: T): boolean =>
		resolve(a, ref) === resolve(b, ref),

	intersection: <T extends number | bigint>(a: BitfieldResolvable<T>, b: BitfieldResolvable<T>, ref: T): T =>
		(resolve(a, ref) & resolve(b, ref)) as T,

	difference: <T extends number | bigint>(a: BitfieldResolvable<T>, b: BitfieldResolvable<T>, ref: T): T =>
		(resolve(a, ref) & ~resolve(b, ref)) as T,

	complement: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, all: T, ref: T): T =>
		(all & ~resolve(bitfield, ref)) as T,

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

	serialize: <T extends number | bigint>(bitfield: BitfieldResolvable<T>, ref: T): string =>
		resolve(bitfield, ref).toString(),

	parse: <T extends number | bigint>(value: string, ref: T): T =>
		(isBigInt(ref) ? BigInt(value) : Number.parseInt(value, 10)) as T,
} as const;
