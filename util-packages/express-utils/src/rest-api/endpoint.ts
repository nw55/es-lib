import { Awaitable, notNull } from '@nw55/common';
import { Log } from '@nw55/logging';
import { requireType, RuntimeType } from '@nw55/runtime-types';
import { ApiResultHandler, EndpointDefinition, EndpointSignature, HttpError, QueryParameterFormat, RestMethod, RouteParameterFormat } from '@nw55/web';
import { Request, RequestHandler, Response, Router } from 'express';

const logger = Log.createLogger('@nw55/express-utils/rest-api/endpoint');

type AnyEndpointImplementation = (...args: unknown[]) => Awaitable<unknown>;

interface Result {
    status: number;
    data?: unknown | undefined;
}

export class EndpointRequestHandler<E extends EndpointDefinition = EndpointDefinition> {
    private _method: RestMethod;
    private _routePath: string;
    private _routeParameters: (readonly [string, RouteParameterFormat<unknown> | null])[];
    private _queryParameters: [string, QueryParameterFormat<unknown>][];
    private _dataType: RuntimeType<unknown> | null;
    private _resultHandler: ApiResultHandler<unknown, unknown>;
    private _implementation: AnyEndpointImplementation;

    constructor(endpointDefinition: E, implementation: EndpointSignature<E>) {
        this._method = endpointDefinition.method;
        this._routePath = endpointDefinition.route.path;
        this._routeParameters = endpointDefinition.route.pathSegments.map(
            segment => segment.type === 'parameter' ? [segment.name, segment.format] as const : null
        ).filter(notNull);
        this._queryParameters = Object.entries(endpointDefinition.queryParameters);
        this._dataType = endpointDefinition.dataType;
        this._resultHandler = endpointDefinition.resultHandler;
        this._implementation = implementation as AnyEndpointImplementation;
    }

    mountToRouter(router: Router) {
        const path = this._routePath;
        const handler = this._requestHandlerEntrypoint;

        switch (this._method) {
            case 'GET':
                router.get(path, handler);
                break;
            case 'POST':
                router.post(path, handler);
                break;
            case 'PUT':
                router.put(path, handler);
                break;
            case 'DELETE':
                router.delete(path, handler);
                break;
        }
    }

    private _requestHandlerEntrypoint: RequestHandler = (req, res, next) => {
        this._handleRequestAndErrors(req, res).catch(next);
    };

    private async _handleRequestAndErrors(req: Request, res: Response) {
        logger.trace(`> ${req.method} ${req.url}`);

        let result: Result;
        let error = false;

        try {
            result = await this._handleRequest(req);
        }
        catch (e: unknown) {
            error = true;
            result = this._handleError(e);
        }

        logger.trace(`< ${result.status}${error ? ' (from error)' : ''}`);

        res.status(result.status);
        if (result.data !== undefined)
            res.json(result.data);
        else
            res.end();
    }

    private async _handleRequest(req: Request): Promise<Result> {
        const routeParameters = this._handleRouteParameters(req);
        const queryParameters = this._handleQueryParameters(req);

        const implementationArgs = [];

        if (routeParameters !== null || queryParameters !== null) {
            implementationArgs.push({
                ...routeParameters,
                ...queryParameters
            });
        }

        if (this._dataType !== null) {
            try {
                requireType(this._dataType, req.body);
            }
            catch (e: unknown) {
                if (e instanceof TypeError)
                    throw new HttpError(400, 'Wrong request data type: ' + e.message, e);
                throw e; // eslint-disable-line @typescript-eslint/no-throw-literal -- rethrow
            }
            implementationArgs.push(req.body);
        }

        const implementationResult = await this._implementation(...implementationArgs);

        const result = this._resultHandler.handleResult(implementationResult);
        const status = result.status ?? (result.body === undefined ? 204 : 200);

        return { status, data: result.body };
    }

    private _handleRouteParameters(req: Request) {
        if (this._routeParameters.length === 0)
            return null;

        const result: Record<string, unknown> = {};

        for (const [name, format] of this._routeParameters) {
            const value = req.params[name];

            if (typeof value !== 'string')
                throw new Error('Invalid or missing route param');

            if (format !== null) {
                let parsed;
                try {
                    parsed = format.parse(value);
                }
                catch (e: unknown) {
                    if (e instanceof Error)
                        throw new HttpError(400, `Invalid route parameter value for '${name}': ${e.message}`, e);
                    throw e; // eslint-disable-line @typescript-eslint/no-throw-literal -- rethrow
                }

                if (parsed === undefined)
                    throw new HttpError(404, `Invalid route parameter value for '${name}'`);

                result[name] = parsed;
            }
            else {
                result[name] = value;
            }
        }

        return result;
    }

    private _handleQueryParameters(req: Request) {
        if (this._queryParameters.length === 0)
            return null;

        const result: Record<string, unknown> = {};

        for (const [name, format] of this._queryParameters) {
            const value = req.query[name];

            if (value !== undefined && typeof value !== 'string')
                throw new Error('Invalid query param');

            try {
                result[name] = format.parse(value);
            }
            catch (e: unknown) {
                if (e instanceof Error)
                    throw new HttpError(400, `Invalid query parameter format for '${name}': ${e.message}`, e);
                throw e; // eslint-disable-line @typescript-eslint/no-throw-literal -- rethrow
            }
        }

        return result;
    }

    private _handleError(error: unknown): Result {
        if (!(error instanceof Error)) {
            logger.error(`Caught non-Error: ${String(error)}`);
            return { status: 500 };
        }

        if (error instanceof HttpError) {
            logger.debug(`Caught HttpError: ${error.status} - ${error.message}`);
            if (error.status !== 0)
                return { status: error.status };
        }

        if (this._resultHandler.handleError === undefined) {
            logger.logError('warn', error, `Unexepected error`);
            return { status: 500 };
        }

        const result = this._resultHandler.handleError(error);
        const status = result.status ?? 500;

        return { status, data: result.body };
    }
}
