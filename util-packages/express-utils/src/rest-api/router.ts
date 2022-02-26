import { ApiInterface, EndpointDefinition } from '@nw55/web';
import express, { Router } from 'express';
import { EndpointRequestHandler } from './endpoint';

export function createApiRouter<T extends Record<string, EndpointDefinition>>(apiDefinition: T, apiImpl: ApiInterface<T>) {
    const router = Router();

    router.use(express.json());

    for (const [key, endpoint] of Object.entries(apiDefinition)) {
        const handler = new EndpointRequestHandler(endpoint, apiImpl[key]);
        handler.mountToRouter(router);
    }

    return router;
}
