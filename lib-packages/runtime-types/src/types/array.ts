import { isArray, Mutable } from '@nw55/common';
import { CheckableType, RuntimeType, TypeCheckOptions, TypeCheckResult } from '../common.js';

export class ArrayType<T> extends RuntimeType<T[]> {
    private _element: RuntimeType<T>;

    constructor(element: RuntimeType<T>) {
        super();

        this._element = element;
    }

    get element() {
        return this._element;
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        const result: Mutable<TypeCheckResult> = {
            success: true,
            errors: []
        };

        if (isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                const elementValue = value[i];
                const elementResult = this._element[CheckableType.check](elementValue, options);
                if (!elementResult.success) {
                    result.success = false;
                    if (options.returnDetails) {
                        result.errors.push({
                            path: i,
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
                    path: null,
                    message: 'Value is not an array.',
                    nestedErrors: []
                });
            }
        }

        return result;
    }
}
