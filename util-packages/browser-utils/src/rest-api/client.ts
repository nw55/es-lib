import { ApiInterface, EndpointDefinition } from '@nw55/web';
import { ApiClientOptions } from './common';
import { EndpointFetchHandler } from './endpoint';

export function createApiClient<T extends Record<string, EndpointDefinition>>(apiDefinition: T, options: ApiClientOptions): ApiInterface<T> {
    const client: Record<string, unknown> = {};

    for (const [key, endpoint] of Object.entries(apiDefinition)) {
        const handler = new EndpointFetchHandler(endpoint, options);
        client[key] = handler.entrypoint;
    }

    return client as ApiInterface<T>;
}
