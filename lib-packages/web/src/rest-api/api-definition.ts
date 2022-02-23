import { EndpointDefinition, EndpointSignature } from './endpoints';

interface ApiDefinition {
    [key: string]: EndpointDefinition<any, any, any, any>;
}

type Simplify<T> = T extends object ? { [P in keyof T]: T[P]; } : T;

export type ApiInterface<T extends ApiDefinition> = Simplify<{
    [P in keyof T]: EndpointSignature<T[P]>;
}>;
