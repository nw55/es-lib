import { isPlainObject, Mutable } from '@nw55/common';
import { CheckableType, RuntimeType, TypeCheckOptions, TypeCheckResult } from '../common';

export class RecordType<K extends string, V> extends RuntimeType<Record<K, V>> {
    private _keyType: RuntimeType<K>;
    private _valueType: RuntimeType<V>;

    constructor(keyType: RuntimeType<K>, valueType: RuntimeType<V>) {
        super();

        this._keyType = keyType;
        this._valueType = valueType;
    }

    get keyType() {
        return this._keyType;
    }

    get valueType() {
        return this._valueType;
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult {
        const result: Mutable<TypeCheckResult> = {
            success: true,
            errors: []
        };

        if (isPlainObject(value)) {
            for (const [key, propertyValue] of Object.entries(value)) {
                const keyResult = this._keyType[CheckableType.check](key, options);
                if (!keyResult.success) {
                    result.success = false;
                    if (options.returnDetails) {
                        result.errors.push({
                            path: key,
                            message: 'Property key in record object doese not match the type.',
                            nestedErrors: keyResult.errors
                        });
                    }
                    if (options.returnEarly)
                        break;
                }

                const valueResult = this._valueType[CheckableType.check](propertyValue, options);
                if (!valueResult.success) {
                    result.success = false;
                    if (options.returnDetails) {
                        result.errors.push({
                            path: key,
                            message: 'Property value in record object doese not match the type.',
                            nestedErrors: valueResult.errors
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
                    message: 'Value is not a plain object.',
                    nestedErrors: []
                });
            }
        }

        return result;
    }
}
