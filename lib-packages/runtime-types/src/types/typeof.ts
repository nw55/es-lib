import { CheckableType, RuntimeType, TypeCheckOptions, TypeCheckResult } from '../common.js';

interface TypeofMapping {
    'undefined': undefined;
    'object': object | null;
    'boolean': boolean;
    'number': number;
    'bigint': bigint;
    'string': string;
    'symbol': symbol;
    'function': (...args: any[]) => unknown;
}

export class TypeofType<T extends keyof TypeofMapping> extends RuntimeType<TypeofMapping[T]> {
    private _type: T;

    constructor(type: T) {
        super();

        this._type = type;
    }

    get type() {
        return this._type;
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        const success = typeof value === this._type;
        return {
            success,
            errors: !success && options.returnDetails ? [{
                path: null,
                message: `Value of type ${typeof value} does not match expected type ${this._type}.`,
                nestedErrors: []
            }] : []
        };
    }
}
