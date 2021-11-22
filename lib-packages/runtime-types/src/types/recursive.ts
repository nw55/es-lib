import { InvalidOperationError } from '@nw55/common';
import { CheckableType, RuntimeType, TypeCheckOptions, TypeCheckResult } from '../common';

export class RecursiveType<T> extends RuntimeType<T> {
    static create<T>() {
        const type = new RecursiveType<T>();
        return {
            type,
            resolve: type._resolve.bind(type)
        };
    }

    private _resolvedType: CheckableType<T> | null = null;

    get type(): RuntimeType<T> {
        if (this._resolvedType === null)
            throw new InvalidOperationError('RecursiveType was not resolved');
        return this._resolvedType;
    }

    private _resolve(type: RuntimeType<T>) {
        if (this._resolvedType !== null)
            throw new InvalidOperationError('RecursiveType was already resolved');
        this._resolvedType = type;
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult {
        return this.type[CheckableType.check](value, options);
    }
}
