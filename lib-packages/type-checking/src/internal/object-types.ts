import { AnyRecord, Mutable } from '@nw55/common';
import { CheckableType, TypeCheckOptions, TypeCheckResult } from '../common';
import { OptionalType } from './special-types';

function isPlainObject(obj: unknown): obj is AnyRecord {
    if (typeof obj !== 'object' || obj === null)
        return false;
    const prototype = Object.getPrototypeOf(obj) as unknown;
    return prototype === null || prototype === Object.prototype;
}

export interface PlainObjectProperty {
    key: PropertyKey;
    type: CheckableType;
    required: boolean;
}

function pathForPropertyKey(key: PropertyKey) {
    if (typeof key === 'string' && /^[A-Za-z_$][\w$]*$/.test(key))
        return '.' + key;
    return `[${String(key)}]`;
}

export class PlainObjectType<T> implements CheckableType<T> {
    private _allowedPropertyKeys: Set<PropertyKey> | null = null;

    constructor(private _properties: PlainObjectProperty[], noExcessProperties: boolean) {
        if (noExcessProperties)
            this._allowedPropertyKeys = new Set();
        for (const property of _properties) {
            if (property.type instanceof OptionalType) {
                property.type = property.type.type;
                property.required = false;
            }
            if (noExcessProperties)
                this._allowedPropertyKeys!.add(property.key);
        }
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        const result: Mutable<TypeCheckResult> = {
            success: true,
            errors: []
        };

        if (isPlainObject(value)) {
            for (const { key, type, required } of this._properties) {
                if (key in value) {
                    const propertyValue = value[key as string];
                    if (propertyValue === undefined && !required)
                        continue;
                    const propertyResult = type[CheckableType.check](propertyValue, options);
                    if (!propertyResult.success) {
                        result.success = false;
                        if (options.returnDetails) {
                            result.errors.push({
                                path: pathForPropertyKey(key),
                                message: 'Property value in plain object doese not match the type.',
                                nestedErrors: propertyResult.errors
                            });
                        }
                        if (options.returnEarly)
                            break;
                    }
                }
                else if (required) {
                    result.success = false;
                    if (options.returnDetails) {
                        result.errors.push({
                            path: pathForPropertyKey(key),
                            message: 'Missing property in plain object.',
                            nestedErrors: []
                        });
                    }
                    if (options.returnEarly)
                        break;
                }
            }
            if (this._allowedPropertyKeys !== null && (result.success || !options.returnEarly)) {
                for (const key of Object.keys(value)) {
                    if (!this._allowedPropertyKeys.has(key)) {
                        result.success = false;
                        if (options.returnDetails) {
                            result.errors.push({
                                path: pathForPropertyKey(key),
                                message: 'Excess property in plain object.',
                                nestedErrors: []
                            });
                        }
                        if (options.returnEarly)
                            break;
                    }
                }
            }
        }
        else {
            result.success = false;
            if (options.returnDetails) {
                result.errors.push({
                    path: '',
                    message: 'Value is not a plain object.',
                    nestedErrors: []
                });
            }
        }

        return result;
    }
}

export class RecordType<T> implements CheckableType<T> {
    constructor(private _keyType: CheckableType, private _valueType: CheckableType) {
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
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
                            path: pathForPropertyKey(key),
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
                            path: pathForPropertyKey(key),
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
                    path: '',
                    message: 'Value is not a plain object.',
                    nestedErrors: []
                });
            }
        }

        return result;
    }
}
