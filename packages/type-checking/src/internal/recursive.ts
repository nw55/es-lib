import { InvalidOperationError } from '@nw55/common';
import { CheckableType, TypeCheckOptions, TypeCheckResult } from '../common';

export class RecursiveTypeDefinitionRef<T> {
    private _resolvable = new RefResolable<T>();

    get checkableType(): CheckableType<T> {
        return this._resolvable;
    }

    resolve(type: CheckableType<T>) {
        this._resolvable.resolve(type);
    }
}

class RefResolable<T> implements CheckableType<T> {
    private _resolvedCheckableType: CheckableType<T> | null = null;

    resolve(type: CheckableType<T>) {
        if (this._resolvedCheckableType !== null)
            throw new InvalidOperationError('RecursiveTypeDefinitionRef was already resolved');
        this._resolvedCheckableType = type;
    }

    [CheckableType.check](value: unknown, options: TypeCheckOptions): TypeCheckResult<T> {
        if (this._resolvedCheckableType === null)
            throw new InvalidOperationError('RecursiveTypeDefinitionRef was not resolved');
        return this._resolvedCheckableType[CheckableType.check](value, options);
    }
}
