import { isArray, Mutable } from '@nw55/common';
import { CheckableType, TypeCheckOptions, TypeCheckResult } from '../common';

export class TupleType<T> implements CheckableType<T> {
    constructor(private _types: CheckableType[]) {
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        const result: Mutable<TypeCheckResult> = {
            success: true,
            errors: []
        };

        if (isArray(value)) {
            if (value.length === this._types.length) {
                for (let i = 0; i < this._types.length; i++) {
                    const elementValue = value[i];
                    const elementResult = this._types[i][CheckableType.check](elementValue, options);
                    if (!elementResult.success) {
                        result.success = false;
                        if (options.returnDetails) {
                            result.errors.push({
                                path: `[${i}]`,
                                message: 'Property value in tuple doese not match the type.',
                                nestedErrors: elementResult.errors
                            });
                        }
                        if (options.returnEarly)
                            break;
                    }
                }
            }
            else {
                result.success = false;
                if (options.returnDetails) {
                    result.errors.push({
                        path: '',
                        message: `Length ${value.length} of tuple does not match expected length ${this._types.length}.`,
                        nestedErrors: []
                    });
                }
            }
        }
        else {
            result.success = false;
            if (options.returnDetails) {
                result.errors.push({
                    path: '',
                    message: 'Value is not an array.',
                    nestedErrors: []
                });
            }
        }

        return result;
    }
}

export class ArrayType<T> implements CheckableType<T> {
    constructor(private _type: CheckableType) {
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        const result: Mutable<TypeCheckResult> = {
            success: true,
            errors: []
        };

        if (isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                const elementValue = value[i];
                const elementResult = this._type[CheckableType.check](elementValue, options);
                if (!elementResult.success) {
                    result.success = false;
                    if (options.returnDetails) {
                        result.errors.push({
                            path: `[${i}]`,
                            message: 'Property value in array doese not match the type.',
                            nestedErrors: elementResult.errors
                        });
                    }
                    if (options.returnEarly)
                        break;
                }
            }
        }
        else {
            result.success = false;
            if (options.returnDetails) {
                result.errors.push({
                    path: '',
                    message: 'Value is not an array.',
                    nestedErrors: []
                });
            }
        }

        return result;
    }
}
