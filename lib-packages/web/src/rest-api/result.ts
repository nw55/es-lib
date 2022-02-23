import { RuntimeType, Type, TypeDefinition, TypeFromDefinition } from '@nw55/runtime-types';

interface ServerResult<T> {
    status?: number;
    body?: T;
}

type ClientResult<T> = {
    result: T;
} | 'body' | 'error' | null;

export interface ApiResultHandler<B, T> {
    readonly bodyType: RuntimeType<B>;
    readonly handleResult: (result: T) => ServerResult<B>;
    readonly handleError?: (error: Error) => ServerResult<B>;
    readonly handleStatus?: (status: number) => ClientResult<T>;
    readonly handleBody: (body: B) => T;
}

export const ignoreResult: ApiResultHandler<unknown, void> = {
    bodyType: Type.unknown,
    handleResult: () => ({ status: 204 }),
    handleStatus: status => status >= 200 && status <= 299 ? { result: undefined } : null,
    handleBody: () => undefined
};

export const emptyResult: ApiResultHandler<unknown, void> = {
    bodyType: Type.unknown,
    handleResult: () => ({ status: 204 }),
    handleStatus: status => status === 204 ? { result: undefined } : null,
    handleBody: () => { throw Error('Response body is not empty'); }
};

type IdentityResultHandler<T> = ApiResultHandler<T, T>;
type UnionResultHandler<T, U> = ApiResultHandler<T, T | U>;

export function singleResult<D extends TypeDefinition>(typeDefinition: D) {
    const handler: IdentityResultHandler<unknown> = {
        bodyType: Type.from(typeDefinition),
        handleResult: result => ({ body: result }),
        handleBody: body => body
    };
    return handler as IdentityResultHandler<TypeFromDefinition<D>>;
}

export function singleResultOr404<D extends TypeDefinition>(typeDefinition: D) {
    const handler: UnionResultHandler<unknown, null> = {
        bodyType: Type.from(typeDefinition),
        handleResult: result => result === null ? { status: 404 } : { body: result },
        handleStatus: status => status === 404 ? { result: null } : null,
        handleBody: body => body
    };
    return handler as UnionResultHandler<TypeFromDefinition<D>, null>;
}

export function multipleResults<D extends TypeDefinition>(typeDefinition: D) {
    return singleResult(Type.array(typeDefinition));
}

export function multipleResultsOr404<D extends TypeDefinition>(typeDefinition: D) {
    return singleResultOr404(Type.array(typeDefinition));
}

export function createdResult<D extends TypeDefinition>(typeDefinition: D) {
    const handler: IdentityResultHandler<unknown> = {
        bodyType: Type.from(typeDefinition),
        handleResult: result => ({ status: 201, body: result }),
        handleStatus: status => status === 201 ? null : 'error',
        handleBody: body => body
    };
    return handler as IdentityResultHandler<TypeFromDefinition<D>>;
}
