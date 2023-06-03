import type { Mutable } from '@nw55/common';
import { CheckableType, RuntimeType, type TypeCheckOptions, type TypeCheckResult } from '../common.js';

type RuntimeTypes<T extends readonly any[]> = {
    [P in keyof T]: RuntimeType<T[P]>;
};

type TupleToIntersection<T extends readonly any[]> = T extends [infer U, ...infer R] ? U & TupleToIntersection<R> : never;

export class IntersectionType<T extends readonly any[]> extends RuntimeType<TupleToIntersection<T>> {
    private _types: RuntimeType<unknown>[];

    constructor(types: RuntimeTypes<T>) {
        super();

        this._types = [];
        for (const type of types) {
            if (type instanceof IntersectionType)
                this._types.push(...type._types);
            else
                this._types.push(type);
        }
    }

    get types(): readonly CheckableType[] {
        return this._types;
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        const intersectionResult: Mutable<TypeCheckResult> = {
            success: true,
            errors: []
        };
        for (let i = 0; i < this._types.length; i++) {
            const result = this._types[i][CheckableType.check](value, options);
            if (!result.success) {
                intersectionResult.success = false;
                if (options.returnDetails) {
                    intersectionResult.errors.push({
                        path: null,
                        message: `Type #${i} of the intersection type does not match.`,
                        nestedErrors: result.errors
                    });
                }
                if (options.returnEarly)
                    break;
            }
        }
        return intersectionResult;
    }
}
