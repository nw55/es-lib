import { CheckableType, RuntimeType, type TypeCheckOptions, type TypeCheckResult } from '@nw55/runtime-types';

export class UnknownType<T> extends RuntimeType<T> {
    private _checkableType: CheckableType<T>;

    constructor(checkableType: CheckableType<T>) {
        super();

        this._checkableType = checkableType;
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        return this._checkableType[CheckableType.check](value, options);
    }
}
