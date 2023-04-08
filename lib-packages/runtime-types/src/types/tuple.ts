import { isArray, Mutable } from '@nw55/common';
import { CheckableType, RuntimeType, RuntimeTypes, TypeCheckOptions, TypeCheckResult } from '../common.js';

export class TupleType<T extends readonly any[]> extends RuntimeType<Mutable<T>> {
    private _elements: readonly RuntimeType<unknown>[];

    constructor(elements: RuntimeTypes<T>) {
        super();

        this._elements = elements;
    }

    get elements() {
        return this._elements;
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        const result: Mutable<TypeCheckResult> = {
            success: true,
            errors: []
        };

        if (isArray(value)) {
            if (value.length === this._elements.length) {
                for (let i = 0; i < this._elements.length; i++) {
                    const elementValue = value[i];
                    const elementResult = this._elements[i][CheckableType.check](elementValue, options);
                    if (!elementResult.success) {
                        result.success = false;
                        if (options.returnDetails) {
                            result.errors.push({
                                path: i,
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
                        path: null,
                        message: `Length ${value.length} of tuple does not match expected length ${this._elements.length}.`,
                        nestedErrors: []
                    });
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
