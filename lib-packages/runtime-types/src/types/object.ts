import { DeepReadonly, isPlainObject, Mutable } from '@nw55/common';
import { CheckableType, RuntimeType, TypeCheckOptions, TypeCheckResult } from '../common';

export interface ObjectPropertyType<K extends string = string, T = unknown, O extends boolean = boolean> {
    key: K;
    type: RuntimeType<T>;
    optional: O;
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type Helper<T, O extends boolean> = T extends ObjectPropertyType<string, unknown, O> ? {
    [P in T['key']]: CheckableType.ExtractType<T['type']>;
} : never;

type PropertiesToObjectType<T extends readonly ObjectPropertyType[]> =
    UnionToIntersection<Helper<T[Exclude<keyof T, keyof []>], false>> &
    Partial<UnionToIntersection<Helper<T[Exclude<keyof T, keyof []>], true>>>;

export class ObjectType<T extends readonly ObjectPropertyType[]> extends RuntimeType<PropertiesToObjectType<T>> {
    private _properties: T;
    private _allowedPropertyKeys: Set<PropertyKey> | null = null;

    constructor(properties: T, noExcessProperties: boolean) {
        super();

        this._properties = properties;
        if (noExcessProperties) {
            this._allowedPropertyKeys = new Set();
            for (const property of properties)
                this._allowedPropertyKeys.add(property.key);
        }
    }

    get properties() {
        return this._properties as DeepReadonly<T>;
    }

    get noExcessProperties() {
        return this._allowedPropertyKeys !== null;
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult {
        const result: Mutable<TypeCheckResult> = {
            success: true,
            errors: []
        };

        if (isPlainObject(value)) {
            for (const { key, type, optional } of this._properties) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    const propertyValue = value[key];
                    const propertyResult = type[CheckableType.check](propertyValue, options);
                    if (!propertyResult.success) {
                        result.success = false;
                        if (options.returnDetails) {
                            result.errors.push({
                                path: key,
                                message: 'Property value in plain object doese not match the type.',
                                nestedErrors: propertyResult.errors
                            });
                        }
                        if (options.returnEarly)
                            break;
                    }
                }
                else if (!optional) {
                    result.success = false;
                    if (options.returnDetails) {
                        result.errors.push({
                            path: key,
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
                                path: key,
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
                    path: null,
                    message: 'Value is not a plain object.',
                    nestedErrors: []
                });
            }
        }

        return result;
    }
}
