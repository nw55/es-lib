import { ArgumentError } from '@nw55/common';
import { Log } from '@nw55/logging';
import { requireType, RuntimeType } from '@nw55/runtime-types';
import { ApiResultHandler, EndpointDefinition, HttpError, QueryParameterFormat, RestMethod, RoutePathSegment } from '@nw55/web';
import { ApiClientOptions } from './common';

const logger = Log.createLogger('@nw55/browser-utils/rest-api/endpoint');

function validateBaseUrl(baseUrl: URL | string) {
    if (typeof baseUrl === 'string')
        baseUrl = new URL(baseUrl);
    if (!baseUrl.pathname.endsWith('/'))
        baseUrl.pathname += '/';
    baseUrl.search = '';
    baseUrl.hash = '';
    return baseUrl.href;
}

export class EndpointFetchHandler {
    private _method: RestMethod;
    private _pathSegments: RoutePathSegment[];
    private _queryParameters: [string, QueryParameterFormat<unknown>][];
    private _dataType: RuntimeType<unknown> | null;
    private _resultHandler: ApiResultHandler<unknown, unknown>;
    private _baseUrl: string;

    constructor(endpointDefinition: EndpointDefinition, options: ApiClientOptions) {
        this._method = endpointDefinition.method;
        this._pathSegments = endpointDefinition.route.pathSegments;
        this._queryParameters = Object.entries(endpointDefinition.queryParameters);
        this._dataType = endpointDefinition.dataType;
        this._resultHandler = endpointDefinition.resultHandler;
        this._baseUrl = validateBaseUrl(options.baseUrl);
    }

    entrypoint = (...args: unknown[]) => this._sendRequest(args);

    private async _sendRequest(args: unknown[]) {
        const hasParameters = this._pathSegments.length > 0 || this._queryParameters.length;
        const hasData = this._dataType !== null;
        let argIndex = 0;
        const parameters = hasParameters ? args[argIndex++] as Record<string, unknown> : {};
        const data = hasData ? args[argIndex++] : undefined;

        const url = this._generateUrl(parameters);

        if (this._dataType !== null) {
            if (data === undefined)
                throw new ArgumentError('Missing data parameter');
        }

        logger.trace(`> ${this._method} ${url}`);

        const response = await fetch(url, {
            method: this._method,
            headers: {
                'Accept': 'application/json',
                ...(data !== undefined ? { 'Content-Type': 'application/json' } : undefined)
            },
            body: data !== undefined ? JSON.stringify(data) : null
        });

        logger.trace(`< ${response.status} ${response.statusText}`);

        const result = await this._handleResponse(response);

        return result;
    }

    private _generateUrl(parameters: Record<string, unknown>) {
        const path = this._pathSegments.map(segment => {
            if (segment.type === 'fixed')
                return segment.value;
            const value = parameters[segment.name];
            if (value === undefined)
                throw new ArgumentError(`Missing route parameter '${segment.name}'`);
            const formatted = segment.format === null ? value : segment.format.format(value);
            if (typeof formatted !== 'string')
                throw new ArgumentError(`Invalid route parameter type for '${segment.name}'`);
            if (formatted === '')
                throw new ArgumentError(`Empty route parameter '${segment.name}'`);
            return formatted;
        }).join('/');

        const search = new URLSearchParams();
        for (const [name, type] of this._queryParameters) {
            const value = parameters[name];
            const formatted = type.format(value);
            if (formatted !== undefined)
                search.set(name, formatted);
        }

        const url = new URL(path, this._baseUrl);
        url.search = search.toString();
        return url.href;
    }

    private async _handleResponse(response: Response) {
        let forceUseBody = false;

        if (this._resultHandler.handleStatus !== undefined) {
            const result = this._resultHandler.handleStatus(response.status);
            if (result !== null) {
                if (result === 'error')
                    throw new HttpError(response.status, response.statusText);
                else if (result === 'body')
                    forceUseBody = true;
                else
                    return result.result;
            }
        }

        if (!forceUseBody) {
            if (response.status < 200 || response.status >= 300)
                throw new HttpError(response.status, response.statusText);
            if (response.status === 204)
                return undefined;
        }

        if (response.body === null)
            throw new HttpError(0, 'Missing response body');

        const body = await response.json();
        requireType(this._resultHandler.bodyType, body);
        const result = this._resultHandler.handleBody(body);

        return result;
    }
}
