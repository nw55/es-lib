import { ArgumentError, Awaitable, notNull } from '@nw55/common';
import { CheckableType } from '@nw55/runtime-types';
import { ApiParameterFormat } from './parameters';
import { ApiResult, ApiResultHandler } from './results';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type PathSegmentParam<T> = T extends `:${infer P}` ? P : never;

type PathParams<Path> =
    Path extends `/${infer Segment}/${infer Rest}` ?
    PathSegmentParam<Segment> | PathParams<`/${Rest}`> :
    Path extends `/${infer Segment}` ?
    PathSegmentParam<Segment> :
    never;

type QueryParams<Params> = {
    [P in keyof Params]: Params[P] extends ApiParameterFormat<infer T> ? T : never;
};

type OptionalIfUndefined<T> =
    { [P in keyof T as undefined extends T[P] ? P : never]?: T[P]; }
    & { [P in keyof T as undefined extends T[P] ? never : P]: T[P]; };

type Simplify<T> = T extends object ? { [P in keyof T]: T[P]; } : T;

type RouteParams<R, P> = Simplify<{ [P2 in Exclude<PathParams<R>, keyof P>]: string; } & OptionalIfUndefined<QueryParams<P>>>;

type ApiParams = Record<string, ApiParameterFormat<any>>;

const apiEndpointDefinition = Symbol();

export interface ApiEndpointDefinition<Sig> {
    [apiEndpointDefinition]: Sig;
    method: ApiMethod;
    route: string;
    routeParams: string[];
    params: ApiParams;
    requestData: CheckableType | null;
    response: ApiResultHandler<unknown, unknown>;
}

type EntpointParams<P, Req> =
    keyof P extends never ?
    ([Req] extends [never] ? [] : [data: Req]) :
    ([Req] extends [never] ? [params: P] : [params: P, data: Req]);

type ApiEndpointSignature<R, P, Req, TRes> = (...params: EntpointParams<RouteParams<R, P>, Req>) => Awaitable<TRes>;

type Path = `/${string}`;

export namespace RestApi {
    export function route<R extends Path, P extends ApiParams = {}, Req = never, TRes = void, BRes = never>(
        method: ApiMethod,
        route: R,
        params?: P,
        requestData: CheckableType<Req> | null = null,
        response?: ApiResultHandler<BRes, TRes>
    ): ApiEndpointDefinition<ApiEndpointSignature<R, P, Req, TRes>> {
        const routeParams = route.split('/').map(segment => {
            if (segment.startsWith(':'))
                return segment.slice(1);
            return null;
        }).filter(notNull);

        const uniqueRouteParams = new Set(routeParams);

        if (uniqueRouteParams.size !== routeParams.length)
            throw new ArgumentError('Duplicate route param');

        return {
            [apiEndpointDefinition]: undefined as any,
            method,
            route,
            routeParams,
            params: params ?? {},
            requestData,
            response: response ?? (ApiResult.empty as any)
        };
    }

    type ApiInterfaceInternal<T> = {
        [P in keyof T]: T[P] extends ApiEndpointDefinition<infer Sig> ? Sig : never;
    };

    const apiInterface = Symbol();

    export interface Definition<Interface> {
        [apiInterface]: Interface;
        endpoints: Record<string, ApiEndpointDefinition<unknown>>;
    }

    export function definition<T extends Record<string, ApiEndpointDefinition<unknown>>>(endpoints: T): Definition<ApiInterfaceInternal<T>> {
        return {
            [apiInterface]: undefined as any,
            endpoints
        };
    }

    export type Interface<T extends Definition<unknown>> = T extends Definition<infer I> ? I : never;
}

export interface RestApiMetadata {
    readonly title: string;
    readonly version: string;
}
