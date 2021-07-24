import { CheckableType, TypeCheckOptions, TypeCheckResult } from '../common';

export class LiteralType<T> implements CheckableType<T> {
    constructor(private _value: unknown) {
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        const success = value === this._value;
        return {
            success,
            errors: !success && options.returnDetails ? [{
                path: '',
                message: `Value ${String(value)} does not match literal type ${String(this._value)}.`,
                nestedErrors: []
            }] : []
        };
    }
}

export class TypeofType<T> implements CheckableType<T> {
    constructor(private _type: string) {
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        const success = typeof value === this._type;
        return {
            success,
            errors: !success && options.returnDetails ? [{
                path: '',
                message: `Value of type ${typeof value} does not match expected type ${this._type}.`,
                nestedErrors: []
            }] : []
        };
    }
}
