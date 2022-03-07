import { concatPathRoutes, ConcatPathRoutes, pathRoute, PathRouteInfo, ResolvePathRoute, RoutePath } from '../urls';
import { EndpointDefinition, EndpointSignature } from './endpoints';

export interface ApiDefinition {
    [key: string]: ApiDefinition | EndpointDefinition;
}

type Simplify<T> = T extends object ? { [P in keyof T]: T[P]; } : T;

export type ApiInterface<T extends ApiDefinition> = Simplify<{
    [P in keyof T]:
    T[P] extends EndpointDefinition<any, any, any, any> ? EndpointSignature<T[P]> :
    T[P] extends ApiDefinition ? ApiInterface<T[P]> : never;
}>;

export function isEndpointDefinition(definition: ApiDefinition | EndpointDefinition): definition is EndpointDefinition {
    return typeof definition.method === 'string';
}

type EndpointWithRoute<R1 extends PathRouteInfo, E extends EndpointDefinition> =
    E extends EndpointDefinition<infer R2, infer Q, infer D, infer T>
    ? EndpointDefinition<ConcatPathRoutes<R1, R2>, Q, D, T>
    : never;

type DefinitionWithRoute<R extends PathRouteInfo, T extends ApiDefinition | EndpointDefinition> = {
    [P in keyof T]:
    T[P] extends EndpointDefinition<any, any, any, any> ? EndpointWithRoute<R, T[P]> :
    T[P] extends ApiDefinition ? DefinitionWithRoute<R, T[P]> : never;
};

function endpointWithRoute(routeOrPath: PathRouteInfo | RoutePath, definition: EndpointDefinition): EndpointDefinition {
    const route = typeof routeOrPath === 'string' ? pathRoute(routeOrPath) : routeOrPath;
    return {
        ...definition,
        route: concatPathRoutes(route, definition.route)
    };
}

function definitionWithRoute(
    routeOrPath: PathRouteInfo | RoutePath, definition: EndpointDefinition | ApiDefinition
): EndpointDefinition | ApiDefinition {
    if (isEndpointDefinition(definition))
        return endpointWithRoute(routeOrPath, definition);
    return Object.fromEntries(Object.entries(definition).map(
        ([key, entryDefinition]) => [key, definitionWithRoute(routeOrPath, entryDefinition)]
    ));
}

export function withRoute<
    R extends PathRouteInfo | RoutePath, D extends ApiDefinition | EndpointDefinition
>(
    route: R, definition: D
): DefinitionWithRoute<ResolvePathRoute<R>, D> {
    return definitionWithRoute(route, definition) as DefinitionWithRoute<ResolvePathRoute<R>, D>;
}
