import { Mutable } from '@nw55/common';
import { CheckableType, TypeCheckOptions, TypeCheckResult } from '../common';

export class UnionType<T> implements CheckableType<T> {
    private _types: CheckableType[] = [];

    constructor(types: CheckableType[]) {
        for (const type of types) {
            if (type instanceof UnionType)
                this._types.push(...type._types);
            else
                this._types.push(type);
        }
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        const unionResult: TypeCheckResult = {
            success: false,
            errors: []
        };
        for (let i = 0; i < this._types.length; i++) {
            const type = this._types[i];
            const result = type[CheckableType.check](value, options);
            if (result.success)
                return { success: true, errors: [] };
            if (options.returnDetails) {
                unionResult.errors.push({
                    path: '',
                    message: `Type #${i} of the union type does not match.`,
                    nestedErrors: result.errors
                });
            }
        }
        return unionResult;
    }
}

export class IntersectionType<T> implements CheckableType<T> {
    private _types: CheckableType[] = [];

    constructor(types: CheckableType[]) {
        for (const type of types) {
            if (type instanceof IntersectionType)
                this._types.push(...type._types);
            else
                this._types.push(type);
        }
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        const intersectionResult: Mutable<TypeCheckResult> = {
            success: true,
            errors: []
        };
        for (let i = 0; i < this._types.length; i++) {
            const type = this._types[i];
            const result = type[CheckableType.check](value, options);
            if (!result.success) {
                intersectionResult.success = false;
                if (options.returnDetails) {
                    intersectionResult.errors.push({
                        path: '',
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

export class OptionalType<T> implements CheckableType<T> {
    constructor(public readonly type: CheckableType) {
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        if (value !== undefined) {
            const innerResult = this.type[CheckableType.check](value, options);
            if (!innerResult.success) {
                return {
                    success: false,
                    errors: [{
                        path: '',
                        message: `Optional type does not match since the value is not undefined and does not match the type.`,
                        nestedErrors: innerResult.errors
                    }]
                };
            }
        }
        return { success: true, errors: [] };
    }
}
