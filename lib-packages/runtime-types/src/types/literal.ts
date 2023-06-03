import { CheckableType, RuntimeType, type TypeCheckOptions, type TypeCheckResult } from '../common.js';

export class LiteralType<T> extends RuntimeType<T> {
    private _value: T;

    constructor(value: T) {
        super();

        this._value = value;
    }

    get value() {
        return this._value;
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        const success = value === this._value;
        return {
            success,
            errors: !success && options.returnDetails ? [{
                path: null,
                message: `Value ${String(value)} does not match literal type ${String(this._value)}.`,
                nestedErrors: []
            }] : []
        };
    }
}
