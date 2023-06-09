import type { Awaitable, SimplifyObjectType } from '@nw55/common';
import type { RuntimeType } from '@nw55/runtime-types';
import { pathRoute, type PathRouteInfo, type QueryParameters, type ResolvePathRoute, type ResolveQueryParameterTypes, type ResolveRouteParameterTypes, type RoutePath } from '../urls.js';
import type { ApiResultHandler } from './result.js';

export type RestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface EndpointDefinition<R extends PathRouteInfo = PathRouteInfo, Q extends QueryParameters = QueryParameters, D = unknown, T = unknown> {
    method: RestMethod;
    route: R;
    queryParameters: Q;
    dataType: RuntimeType<D> | null;
    resultHandler: ApiResultHandler<any, T>;
}

type EntpointParams<P, D> = [
    ...(keyof P extends never ? [] : [parameters: SimplifyObjectType<P>]),
    ...([D] extends [never] ? [] : [data: D])
];

export type EndpointSignature<ED extends EndpointDefinition<any, any, any, any>> =
    ED extends EndpointDefinition<infer R, infer Q, infer D, infer T>
    ? (...params: EntpointParams<ResolveRouteParameterTypes<R> & ResolveQueryParameterTypes<Q>, D>) => Awaitable<T>
    : never;

export function endpoint<R extends PathRouteInfo | RoutePath, Q extends QueryParameters, T>(
    method: RestMethod, route: R, queryParameters: Q, resultHandler: ApiResultHandler<any, T>
): EndpointDefinition<ResolvePathRoute<R>, Q, never, T>;
export function endpoint<R extends PathRouteInfo | RoutePath, Q extends QueryParameters, D, T>(
    method: RestMethod, route: R, queryParameters: Q, dataType: RuntimeType<D>, resultHandler: ApiResultHandler<any, T>
): EndpointDefinition<ResolvePathRoute<R>, Q, D, T>;
export function endpoint(
    method: RestMethod,
    routeOrPath: PathRouteInfo | RoutePath,
    queryParameters: QueryParameters,
    dataTypeOrResultHandler: RuntimeType<unknown> | ApiResultHandler<unknown, unknown>,
    resultHandlerOrNothing?: ApiResultHandler<unknown, unknown>
): EndpointDefinition {
    const route = typeof routeOrPath === 'string' ? pathRoute(routeOrPath) : routeOrPath;
    const dataType = resultHandlerOrNothing === undefined ? null : dataTypeOrResultHandler as RuntimeType<unknown>;
    const resultHandler = resultHandlerOrNothing ?? (dataTypeOrResultHandler as ApiResultHandler<unknown, unknown>);
    return {
        method,
        route,
        queryParameters,
        dataType,
        resultHandler
    };
}
