// eslint-disable-next-line @typescript-eslint/ban-types
export type ConstructorLike<T extends object> = Omit<Function, 'prototype'> & { prototype: T; };

// eslint-disable-next-line @typescript-eslint/ban-types
export type AnyConstructor<T extends object> = new (...args: any[]) => T;

// eslint-disable-next-line @typescript-eslint/ban-types
export type DefaultConstructor<T extends object> = new () => T;

export type Awaitable<T = unknown> = Promise<T> | T;

export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

export type PartialWithUndefined<T> = {
    [P in keyof T]?: T[P] | undefined;
};

export type DeepMutable<T> =
    T extends Function | null ? T : // eslint-disable-line @typescript-eslint/ban-types
    T extends object ? { -readonly [P in keyof T]: DeepMutable<T[P]>; } : // eslint-disable-line @typescript-eslint/ban-types
    T;

export type DeepPartial<T> =
    T extends Function | null ? T : // eslint-disable-line @typescript-eslint/ban-types
    T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : // eslint-disable-line @typescript-eslint/ban-types
    T;

export type DeepReadonly<T> =
    T extends Function | null ? T : // eslint-disable-line @typescript-eslint/ban-types
    T extends (infer U)[] ? readonly DeepReadonly<U>[] :
    T extends Map<infer K, infer V> ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> :
    T extends Set<infer U> ? ReadonlySet<DeepReadonly<U>> :
    T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]> } : // eslint-disable-line @typescript-eslint/ban-types
    T;

// https://stackoverflow.com/a/50375286
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type SimplifyObjectType<T> = T extends object ? { [P in keyof T]: T[P]; } : T;

export type AnyRecord = Record<PropertyKey, unknown>;

export type TypedArray = Uint32Array | Uint16Array | Uint8Array | Int32Array | Int16Array | Int8Array | Uint8ClampedArray | Float32Array | Float64Array;

export function defaultFactory<TResult, TParams extends any[]>(constructor: new (...args: TParams) => TResult) {
    return (...args: TParams) => new constructor(...args);
}

export function overwrite<T>(base: T, values: Partial<T>): T {
    return { ...base, ...values };
}

export function getIterableFirstElement<T>(iterable: Iterable<T>): T | undefined {
    const result = iterable[Symbol.iterator]().next();
    if (result.done !== true)
        return result.value;
    return undefined;
}

export function notNull<T>(value: T | null): value is T {
    return value !== null;
}

export function notUndefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}

export function notNullable<T>(value: T | null | undefined): value is T {
    return value !== null || value !== undefined;
}

export function isArray(value: unknown): value is readonly unknown[] {
    return Array.isArray(value);
}

export function isPlainObject(obj: unknown): obj is AnyRecord {
    if (typeof obj !== 'object' || obj === null)
        return false;
    const prototype = Object.getPrototypeOf(obj) as unknown;
    return prototype === null || prototype === Object.prototype;
}

// based on https://stackoverflow.com/a/7616484
export function getStringHashCode(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash |= 0;
    }
    return hash;
}

// based on https://stackoverflow.com/a/1646913
export function combineHashCodes(...values: number[]) {
    let hash = 17;
    for (const value of values)
        hash = (hash * 31 + value) | 0;
    return hash;
}

export function createRecord<K extends PropertyKey, T>(keys: readonly K[], mapToValues: (key: K) => T) {
    return Object.fromEntries(keys.map(key => [key, mapToValues(key)])) as Record<K, T>;
}

export function mapRecord<K extends PropertyKey, T, U>(record: Record<K, T>, mapValue: (value: T, key: K) => U): Record<K, U>;
export function mapRecord<K extends PropertyKey, T, U>(record: PartialWithUndefined<Record<K, T>>, mapValue: (value: T | undefined, key: K) => U): Record<K, U>;
export function mapRecord<K extends PropertyKey, T, U>(record: Record<K, T>, mapValue: (value: T, key: K) => U) {
    return Object.fromEntries(Object.entries<T>(record).map(([key, value]) => [key, mapValue(value, key as K)]));
}

export function filterRecord<K extends PropertyKey, T>(record: Record<K, T>, filterValue: (value: T, key: K) => boolean): Partial<Record<K, T>>;
export function filterRecord<K extends PropertyKey, T>(record: PartialWithUndefined<Record<K, T>>, filterValue: (value: T | undefined, key: K) => boolean): PartialWithUndefined<Record<K, T>>;
export function filterRecord<K extends PropertyKey, T>(record: Record<K, T>, filterValue: (value: T, key: K) => boolean) {
    return Object.fromEntries(Object.entries<T>(record).filter(([key, value]) => filterValue(value, key as K)));
}
