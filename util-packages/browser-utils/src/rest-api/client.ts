import type { Awaitable } from '@nw55/common';
import { isEndpointDefinition, type ApiDefinition, type ApiInterface } from '@nw55/web';
import type { ApiClientOptions } from './common.js';
import { EndpointFetchHandler } from './endpoint.js';

interface ApiImplementation {
    [key: string]: ApiImplementation | ((...args: unknown[]) => Awaitable<unknown>);
}

function createClientObject(definition: ApiDefinition, options: ApiClientOptions): ApiImplementation {
    const client: ApiImplementation = {};

    for (const [key, entryDefinition] of Object.entries(definition)) {
        if (isEndpointDefinition(entryDefinition)) {
            const handler = new EndpointFetchHandler(entryDefinition, options);
            client[key] = handler.entrypoint;
        }
        else {
            const entryObject = createClientObject(entryDefinition, options);
            client[key] = entryObject;
        }
    }

    return client;
}

export function createApiClient<T extends ApiDefinition>(definition: T, options: ApiClientOptions): ApiInterface<T> {
    const client = createClientObject(definition, options);
    return client as ApiInterface<T>;
}
