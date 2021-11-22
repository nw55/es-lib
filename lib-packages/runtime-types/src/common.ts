export interface TypeCheckOptions {
    readonly returnEarly: boolean;
    readonly returnDetails: boolean;
}

export interface TypeCheckError {
    readonly path: string | number | null;
    readonly message: string;
    readonly nestedErrors: TypeCheckError[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TypeCheckResult<T = unknown> {
    readonly success: boolean;
    readonly errors: TypeCheckError[];
}

export interface CheckableType<T = unknown> {
    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T>;
}

export namespace CheckableType {
    export const check = Symbol('CheckableType.check');

    export type ExtractType<T extends CheckableType<unknown>> = T extends CheckableType<infer U> ? U : never;

    export function test<T>(obj: T): obj is T & CheckableType<unknown> {
        return check in obj;
    }
}

export abstract class RuntimeType<T> implements CheckableType<T> {
    abstract [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T>;
}

export type RuntimeTypes<T extends readonly any[]> = {
    [P in keyof T]: RuntimeType<T[P]>;
};
