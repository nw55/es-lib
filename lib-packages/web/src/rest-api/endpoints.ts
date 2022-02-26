import { Awaitable } from '@nw55/common';
import { RuntimeType } from '@nw55/runtime-types';
import { ConcatPathRoutes, concatPathRoutes, pathRoute, PathRouteInfo, QueryParameters, ResolvePathRouteType, ResolveQueryParameterTypes, ResolveRouteParameterTypes, RoutePath } from '../urls';
import { ApiResultHandler } from './result';

export type RestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface EndpointDefinition<R extends PathRouteInfo = PathRouteInfo, Q extends QueryParameters = QueryParameters, D = unknown, T = unknown> {
    method: RestMethod;
    route: R;
    queryParameters: Q;
    dataType: RuntimeType<D> | null;
    resultHandler: ApiResultHandler<any, T>;
}

type EntpointParams<P, D> = [
    ...(keyof P extends never ? [] : [parameters: Simplify<P>]),
    ...([D] extends [never] ? [] : [data: D])
];

type Simplify<T> = T extends object ? { [P in keyof T]: T[P]; } : T;

export type EndpointSignature<ED extends EndpointDefinition<any, any, any, any>> =
    ED extends EndpointDefinition<infer R, infer Q, infer D, infer T>
    ? (...params: EntpointParams<ResolveRouteParameterTypes<R> & ResolveQueryParameterTypes<Q>, D>) => Awaitable<T>
    : never;

export function endpoint<R extends PathRouteInfo, Q extends QueryParameters, D = never, T = never>(
    method: RestMethod, route: R, queryParameters: Q, dataType: RuntimeType<D> | null, resultHandler: ApiResultHandler<any, T>
): EndpointDefinition<R, Q, D, T>;
export function endpoint<P extends RoutePath, Q extends QueryParameters, D = never, T = never>(
    method: RestMethod, routePath: P, queryParameters: Q, dataType: RuntimeType<D> | null, resultHandler: ApiResultHandler<any, T>
): EndpointDefinition<ResolvePathRouteType<P>, Q, D, T>;
export function endpoint(
    method: RestMethod, routeOrPath: PathRouteInfo | RoutePath, queryParameters: QueryParameters, dataType: RuntimeType<any> | null, resultHandler: ApiResultHandler<any, any>
): EndpointDefinition<PathRouteInfo, QueryParameters, any, any> {
    const route = typeof routeOrPath === 'string' ? pathRoute(routeOrPath) : routeOrPath;
    return {
        method,
        route,
        queryParameters,
        dataType,
        resultHandler
    };
}

type EndpointGroup = Record<string, EndpointDefinition<any, any, any, any>>;

type ConcatGroupRoutes<R1 extends PathRouteInfo, G extends EndpointGroup> = {
    [P in keyof G]: G[P] extends EndpointDefinition<infer R2, infer Q, infer D, infer T>
    ? EndpointDefinition<ConcatPathRoutes<R1, R2>, Q, D, T> : never;
};

export function withRoute<R1 extends PathRouteInfo, R2 extends PathRouteInfo, Q extends QueryParameters, D, T>(
    route: R1, endpoint: EndpointDefinition<R2, Q, D, T> // eslint-disable-line @typescript-eslint/no-shadow
): EndpointDefinition<ConcatPathRoutes<R1, R2>, Q, D, T>;
export function withRoute<P extends RoutePath, R2 extends PathRouteInfo, Q extends QueryParameters, D, T>(
    routePath: P, endpoint: EndpointDefinition<R2, Q, D, T> // eslint-disable-line @typescript-eslint/no-shadow
): EndpointDefinition<ConcatPathRoutes<ResolvePathRouteType<P>, R2>, Q, D, T>;
export function withRoute<R extends PathRouteInfo, G extends EndpointGroup>(
    route: R, endpoints: G
): ConcatGroupRoutes<R, G>;
export function withRoute<P extends RoutePath, G extends EndpointGroup>(
    routePath: P, endpoints: G
): ConcatGroupRoutes<ResolvePathRouteType<P>, G>;
export function withRoute(
    routeOrPath: PathRouteInfo | RoutePath, endpointOrGroup: EndpointDefinition<any, any, any, any> | EndpointGroup
) {
    const route = typeof routeOrPath === 'string' ? pathRoute(routeOrPath) : routeOrPath;
    if (typeof endpointOrGroup.method === 'string') {
        return {
            ...endpointOrGroup,
            route: concatPathRoutes(route, endpointOrGroup.route)
        };
    }
    return Object.fromEntries(Object.entries(endpointOrGroup as EndpointGroup).map(([key, endpointFromGroup]) => [key, {
        ...endpointFromGroup,
        route: concatPathRoutes(route, endpointFromGroup.route)
    }]));
}
