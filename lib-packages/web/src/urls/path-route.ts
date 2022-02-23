import { notNull, ArgumentError } from '@nw55/common';

export type RoutePath = `/${string}`;

type PathSegmentParam<T> = T extends `:${infer P}` ? [P] : [];

export type ExtractRouteParameters<Path extends RoutePath> =
    Path extends `/${infer Segment}/${infer Rest}` ?
    [...PathSegmentParam<Segment>, ...ExtractRouteParameters<`/${Rest}`>] :
    Path extends `/${infer Segment}` ?
    PathSegmentParam<Segment> :
    [];

export interface RouteParameterFormat<T> {
    parse: (str: string) => T | undefined; // undefined -> not found
    format: (value: T) => string;
}

export interface RouteInfo<P extends RoutePath, F extends ParameterFormats<P>> {
    path: P;
    parameters: ExtractRouteParameters<P>;
    parameterFormats: F | {};
}

type ParameterFormats<P extends RoutePath> = {
    [K in ExtractRouteParameters<P>[number]]?: RouteParameterFormat<any>;
};

export function pathRoute<P extends RoutePath>(path: P): RouteInfo<P, {}>;
export function pathRoute<P extends RoutePath, F extends ParameterFormats<P>>(path: P, parameterFormats: F): RouteInfo<P, F>;
export function pathRoute<P extends RoutePath, F extends ParameterFormats<P>>(path: P, parameterFormats?: F): RouteInfo<P, F> {
    const parameters = path.split('/').map(segment => {
        if (segment.startsWith(':'))
            return segment.slice(1);
        return null;
    }).filter(notNull);

    const uniqueParameters = new Set(parameters);
    if (uniqueParameters.size !== parameters.length)
        throw new ArgumentError('Duplicate route param');

    return {
        path,
        parameters: parameters as ExtractRouteParameters<P>,
        parameterFormats: parameterFormats ?? {}
    };
}

export type ResolveRouteParameterTypes<T extends RouteInfo<any, any>> =
    T extends RouteInfo<infer P, infer F>
    ? { [K in ExtractRouteParameters<P>[number]]:
        F[K] extends RouteParameterFormat<infer PF> ? PF : string; }
    : never;
