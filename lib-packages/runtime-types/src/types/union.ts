import { CheckableType, RuntimeType, RuntimeTypes, TypeCheckOptions, TypeCheckResult } from '../common';

type TupleToUnion<T extends readonly any[]> = T[number];

export class UnionType<T extends readonly any[]> extends RuntimeType<TupleToUnion<T>> {
    private _types: CheckableType[];

    constructor(types: RuntimeTypes<T>) {
        super();

        this._types = [];
        for (const type of types) {
            if (type instanceof UnionType)
                this._types.push(...type._types);
            else
                this._types.push(type);
        }
    }

    get types(): readonly CheckableType[] {
        return this._types;
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult {
        const unionResult: TypeCheckResult = {
            success: false,
            errors: []
        };
        for (let i = 0; i < this._types.length; i++) {
            const result = this._types[i][CheckableType.check](value, options);
            if (result.success)
                return { success: true, errors: [] };
            if (options.returnDetails) {
                unionResult.errors.push({
                    path: null,
                    message: `Type #${i} of the union type does not match.`,
                    nestedErrors: result.errors
                });
            }
        }
        return unionResult;
    }
}
