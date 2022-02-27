import { ArgumentError, notNull } from '@nw55/common';

export type RoutePath = `/${string}`;

type PathSegmentParam<T> = T extends `:${infer P}` ? P : never;

type ExtractRouteParameters<Path extends RoutePath> =
    Path extends `/${infer Segment}/${infer Rest}` ?
    PathSegmentParam<Segment> | ExtractRouteParameters<`/${Rest}`> :
    Path extends `/${infer Segment}` ?
    PathSegmentParam<Segment> :
    never;

export type RoutePathSegment = {
    type: 'fixed';
    value: string;
} | {
    type: 'parameter';
    name: string;
    format: RouteParameterFormat<unknown> | null;
};

export interface RouteParameterFormat<T> {
    parse: (str: string) => T | undefined; // undefined -> not found
    format: (value: T) => string;
}

declare const pathRouteInfo: unique symbol;

export interface PathRouteInfo<T extends Record<string, unknown> = Record<string, unknown>> {
    [pathRouteInfo]: T;
    path: string;
    pathSegments: RoutePathSegment[];
}

type ParameterFormats<P extends RoutePath> = {
    [K in ExtractRouteParameters<P>]?: RouteParameterFormat<any>;
};

export type ResolvePathRoute<R extends RoutePath | PathRouteInfo> =
    R extends PathRouteInfo<any> ? R :
    R extends RoutePath ? ResolvePathRouteType<R, {}> : never;

export type ResolvePathRouteType<P extends RoutePath, F extends ParameterFormats<P>> = PathRouteInfo<{
    [K in ExtractRouteParameters<P>]: F[K] extends RouteParameterFormat<infer PF> ? PF : string;
}>;

export function pathRoute<P extends RoutePath>(path: P): ResolvePathRouteType<P, {}>;
export function pathRoute<P extends RoutePath, F extends ParameterFormats<P>>(path: P, parameterFormats: F): ResolvePathRouteType<P, F>;
export function pathRoute(path: string, parameterFormats?: Record<string, RouteParameterFormat<unknown>>): PathRouteInfo {
    const parameters = path.split('/').map(segment => {
        if (segment.startsWith(':'))
            return segment.slice(1);
        return null;
    }).filter(notNull);

    const uniqueParameters = new Set(parameters);
    if (uniqueParameters.size !== parameters.length)
        throw new ArgumentError('Duplicate route param');

    const pathSegments: RoutePathSegment[] = path.split('/').filter(segment => segment !== '').map(segment => {
        if (!segment.startsWith(':'))
            return { type: 'fixed', value: segment };
        const name = segment.slice(1);
        const format = parameterFormats?.[name] ?? null;
        return { type: 'parameter', name, format };
    });;

    return {
        path,
        pathSegments
    } as PathRouteInfo;
}

export type ResolveRouteParameterTypes<R extends PathRouteInfo<any>> = R extends PathRouteInfo<infer T> ? T : never;

export type ConcatPathRoutes<R1 extends PathRouteInfo, R2 extends PathRouteInfo> =
    R1 extends PathRouteInfo<infer T1> ?
    R2 extends PathRouteInfo<infer T2> ?
    PathRouteInfo<T1 & T2>
    : never : never;

export function concatPathRoutes<R1 extends PathRouteInfo, R2 extends PathRouteInfo>(route1: R1, route2: R2): ConcatPathRoutes<R1, R2> {
    const path = route1.path + route2.path;
    const pathSegments = route1.pathSegments.concat(route2.pathSegments);
    return {
        path,
        pathSegments
    } as ConcatPathRoutes<R1, R2>;
}
