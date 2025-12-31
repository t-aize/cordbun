export interface PaginationParams {
	[key: string]: string | number | boolean | undefined;
	before?: string;
	after?: string;
	limit?: number;
}

export interface PaginationWithCountParams extends PaginationParams {
	with_counts?: boolean;
}

export type DeepPartial<T> = T extends object
	? { [P in keyof T]?: DeepPartial<T[P]> }
	: T;

export type DeepRequired<T> = T extends object
	? { [P in keyof T]-?: DeepRequired<T[P]> }
	: T;

export type DeepNullable<T> = T extends object
	? { [P in keyof T]: DeepNullable<T[P]> | null }
	: T | null;

export type DeepNonNullable<T> = T extends object
	? { [P in keyof T]: DeepNonNullable<NonNullable<T[P]>> }
	: NonNullable<T>;

export type DeepDefined<T> = T extends object
	? { [P in keyof T]-?: DeepDefined<Exclude<T[P], undefined>> }
	: Exclude<T, undefined>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
	Required<Pick<T, K>>;

export type NullableBy<T, K extends keyof T> = Omit<T, K> & {
	[P in K]: T[P] | null;
};

export type NonNullableBy<T, K extends keyof T> = Omit<T, K> & {
	[P in K]: NonNullable<T[P]>;
};

export type PickRename<T, K extends keyof T, N extends string> = {
	[P in N]: T[K];
};

export type Merge<T, U> = Omit<T, keyof U> & U;

export type RequiredKeys<T> = {
	[K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type OptionalKeys<T> = {
	[K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

export type DeepMutable<T> = T extends object
	? { -readonly [P in keyof T]: DeepMutable<T[P]> }
	: T;

export type DeepReadonly<T> = T extends object
	? { readonly [P in keyof T]: DeepReadonly<T[P]> }
	: T;
