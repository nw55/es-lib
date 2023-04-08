import { ArgumentError, Awaitable } from '@nw55/common';
import { ApiDefinition, ApiInterface, isEndpointDefinition } from '@nw55/web';
import express, { Router } from 'express';
import { EndpointRequestHandler } from './endpoint.js';

interface ApiImplementation {
    [key: string]: ApiImplementation | ((...args: unknown[]) => Awaitable<unknown>);
}

function* createHandlers(definition: ApiDefinition, implementation: ApiImplementation): IterableIterator<EndpointRequestHandler> {
    for (const [key, entryDefinition] of Object.entries(definition)) {
        const entryImplementation = implementation[key];
        if (isEndpointDefinition(entryDefinition)) {
            if (typeof entryImplementation !== 'function')
                throw new ArgumentError();
            yield new EndpointRequestHandler(entryDefinition, entryImplementation);
        }
        else {
            if (typeof entryImplementation === 'function')
                throw new ArgumentError();
            yield* createHandlers(entryDefinition, entryImplementation);
        }
    }
}

export function createApiRouter<T extends ApiDefinition>(definition: T, implementation: ApiInterface<T>) {
    const router = Router();

    router.use(express.json());

    for (const handler of createHandlers(definition, implementation as ApiImplementation))
        handler.mountToRouter(router);

    return router;
}
