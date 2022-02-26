import { Awaitable } from '@nw55/common';
import { RuntimeType } from '@nw55/runtime-types';
import { pathRoute, QueryParameters, ResolveQueryParameterTypes, ResolveRouteParameterTypes, RouteInfo, RouteParameterFormat, RoutePath } from '../urls';
import { ApiResultHandler } from './result';

export type RestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface EndpointDefinition<R extends RouteInfo<any, any>, Q extends QueryParameters, D, T> {
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

export function endpoint<R extends RouteInfo<any, any>, Q extends QueryParameters, D = never, T = never>(
    method: RestMethod, route: R, queryParameters: Q, dataType: RuntimeType<D> | null, resultHandler: ApiResultHandler<any, T>
): EndpointDefinition<R, Q, D, T>;
export function endpoint<P extends RoutePath, Q extends QueryParameters, D = never, T = never>(
    method: RestMethod, routePath: P, queryParameters: Q, dataType: RuntimeType<D> | null, resultHandler: ApiResultHandler<any, T>
): EndpointDefinition<RouteInfo<P, {}>, Q, D, T>;
export function endpoint(
    method: RestMethod, routeOrPath: RouteInfo<any, any> | RoutePath, queryParameters: QueryParameters, dataType: RuntimeType<any> | null, resultHandler: ApiResultHandler<any, any>
): EndpointDefinition<RouteInfo<any, any>, QueryParameters, any, any> {
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

type AnyRouteInfo = RouteInfo<RoutePath, Record<string, RouteParameterFormat<any>>>;

type ConcatRoutes<R1 extends AnyRouteInfo, R2 extends AnyRouteInfo> =
    R1 extends RouteInfo<infer P1, infer F1> ?
    R2 extends RouteInfo<infer P2, infer F2> ?
    RouteInfo<`${P1}${P2 & string}` & RoutePath, F1 & F2>
    : never : never;

type ConcatRouteWithPath<P1 extends RoutePath, R2 extends AnyRouteInfo> =
    R2 extends RouteInfo<infer P2, infer F2> ?
    RouteInfo<`${P1}${P2 & string}` & RoutePath, F2>
    : never;

type ConcatGroupRoutes<R1 extends RouteInfo<RoutePath, any>, G extends EndpointGroup> = {
    [P in keyof G]: G[P] extends EndpointDefinition<infer R2, infer Q, infer D, infer T>
    ? EndpointDefinition<ConcatRoutes<R1, R2>, Q, D, T> : never;
};

type ConcatGroupRoutesWithPath<P1 extends RoutePath, G extends EndpointGroup> = {
    [P in keyof G]: G[P] extends EndpointDefinition<infer R2, infer Q, infer D, infer T>
    ? EndpointDefinition<ConcatRouteWithPath<P1, R2>, Q, D, T> : never;
};

function concatRoutes<R1 extends AnyRouteInfo, R2 extends AnyRouteInfo>(route1: R1, route2: R2): RouteInfo<any, any> {
    return {
        path: route1.path + route2.path,
        parameters: route1.parameters.concat(route2.parameters) as [],
        parameterFormats: { ...route1.parameterFormats, ...route2.parameterFormats }
    };
}

export function withRoute<R1 extends RouteInfo<any, any>, R2 extends RouteInfo<any, any>, Q extends QueryParameters, D, T>(
    route: R1, endpoint: EndpointDefinition<R2, Q, D, T> // eslint-disable-line @typescript-eslint/no-shadow
): EndpointDefinition<ConcatRoutes<R1, R2>, Q, D, T>;
export function withRoute<P extends RoutePath, R2 extends RouteInfo<any, any>, Q extends QueryParameters, D, T>(
    routePath: P, endpoint: EndpointDefinition<R2, Q, D, T> // eslint-disable-line @typescript-eslint/no-shadow
): EndpointDefinition<ConcatRouteWithPath<P, R2>, Q, D, T>;
export function withRoute<R extends RouteInfo<any, any>, G extends EndpointGroup>(
    route: R, endpoints: G
): ConcatGroupRoutes<R, G>;
export function withRoute<P extends RoutePath, G extends EndpointGroup>(
    routePath: P, endpoints: G
): ConcatGroupRoutesWithPath<P, G>;
export function withRoute(
    routeOrPath: RouteInfo<any, any> | RoutePath, endpointOrGroup: EndpointDefinition<any, any, any, any> | EndpointGroup
) {
    const route = typeof routeOrPath === 'string' ? pathRoute(routeOrPath) : routeOrPath;
    if (typeof endpointOrGroup.method === 'string') {
        return {
            ...endpointOrGroup,
            route: concatRoutes(route, endpointOrGroup.route)
        };
    }
    return Object.fromEntries(Object.entries(endpointOrGroup as EndpointGroup).map(([key, endpointFromGroup]) => [key, {
        ...endpointFromGroup,
        route: concatRoutes(route, endpointFromGroup.route)
    }]));
}
