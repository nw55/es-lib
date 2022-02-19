import { CheckableType, Type, TypeDefinition, TypeFromDefinition } from '@nw55/runtime-types';
import { ApiError } from '.';

interface ServerResult<T> {
    status?: number;
    body?: T;
}

type ClientResult<T> = {
    result: T;
} | 'body' | 'error' | null;

export interface ApiResultHandler<B, T> {
    readonly bodyType: CheckableType<B>;
    readonly handleResult: (result: T) => ServerResult<B>;
    readonly handleError?: (error: Error) => ServerResult<B>;
    readonly handleStatus?: (status: number) => ClientResult<T>;
    readonly handleBody: (body: B) => T;
}

export namespace ApiResult {
    export const empty: ApiResultHandler<never, void> = {
        bodyType: Type.unknown,
        handleResult: () => ({ status: 204 }),
        handleStatus: status => status === 204 ? { result: undefined } : null,
        handleBody: () => { throw new ApiError(0, 'Response body is not empty'); }
    };

    export function value<D extends TypeDefinition, T = TypeFromDefinition<D>>(typeDefinition: D): ApiResultHandler<T, T> {
        return {
            bodyType: Type.from(typeDefinition),
            handleResult: result => ({ body: result }),
            handleBody: body => body
        };
    }

    export function valueOr404<D extends TypeDefinition, T = TypeFromDefinition<D>>(typeDefinition: D): ApiResultHandler<T, T | null> {
        return {
            bodyType: Type.from(typeDefinition),
            handleResult: result => result === null ? { status: 404 } : { body: result },
            handleStatus: status => status === 404 ? { result: null } : null,
            handleBody: body => body
        };
    }

    export function values<D extends TypeDefinition>(typeDefinition: D) {
        return value(Type.array(typeDefinition));
    }

    export function created<D extends TypeDefinition, T = TypeFromDefinition<D>>(typeDefinition: D): ApiResultHandler<T, T> {
        return {
            bodyType: Type.from(typeDefinition),
            handleResult: result => ({ status: 201, body: result }),
            handleStatus: status => status === 201 ? null : 'error',
            handleBody: body => body
        };
    }
}
