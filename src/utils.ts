// eslint-disable-next-line @typescript-eslint/ban-types
export type ConstructorLike<T> = Function & { prototype: T; };

export type AnyConstructor<T> = new (...args: any[]) => T;

export type DefaultConstructor<T> = new () => T;

export type Awaitable<T = unknown> = Promise<T> | T;

export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

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

export function isArray(value: unknown): value is readonly unknown[] {
    return Array.isArray(value);
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
