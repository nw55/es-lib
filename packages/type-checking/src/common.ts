import { AnyRecord } from '@nw55/common/lib/utils';

export interface TypeCheckOptions {
    readonly returnEarly: boolean;
    readonly returnDetails: boolean;
}

export interface TypeCheckError {
    path: string;
    message: string;
    nestedErrors: TypeCheckError[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TypeCheckResult<T = unknown> {
    readonly success: boolean;
    readonly errors: TypeCheckError[];
}

export interface CheckableType<T = unknown> {
    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T>;
}

export type TypeDefinition =
    CheckableType<unknown>
    | string | number | boolean | null | undefined
    | typeof String | typeof Number | typeof Boolean
    | readonly TypeDefinition[]
    | { readonly [key: string]: TypeDefinition; };

export type TypeFromDefinition<T> =
    T extends CheckableType<infer U> ? U :
    T extends string | number | boolean | null | undefined ? T :
    T extends typeof String ? string :
    T extends typeof Number ? number :
    T extends typeof Boolean ? boolean :
    T extends (Readonly<AnyRecord> | readonly unknown[]) ? {
        -readonly [P in keyof T]: TypeFromDefinition<T[P]>
    } :
    never;

export namespace CheckableType {
    export const check = Symbol('CheckableType.check');

    export type ExtractType<T extends CheckableType<unknown>> = T extends CheckableType<infer U> ? U : never;

    export function test<T extends Readonly<AnyRecord> | readonly unknown[]>(obj: T): obj is T & CheckableType<unknown> {
        return check in obj;
    }
}
