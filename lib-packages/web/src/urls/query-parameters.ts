import { ArgumentError, SimplifyObjectType } from '@nw55/common';

export type QueryParameters = Record<string, QueryParameterFormat<unknown>>;

type QueryParamTypes<Params> = {
    [P in keyof Params]: Params[P] extends QueryParameterFormat<infer T> ? T : never;
};

type OptionalIfUndefined<T> =
    { [P in keyof T as undefined extends T[P] ? P : never]?: T[P]; }
    & { [P in keyof T as undefined extends T[P] ? never : P]: T[P]; };

export type ResolveQueryParameterTypes<T extends QueryParameters> = SimplifyObjectType<OptionalIfUndefined<QueryParamTypes<T>>>;

export interface QueryParameterFormat<T> {
    parse(str: string | undefined): T;
    format(value: T): string | undefined;
}

export interface QueryParameterFormatCreator<T> {
    (required: true): QueryParameterFormat<T>;
    (required: false): QueryParameterFormat<T | undefined>;
}

export interface QueryParameterFormatCreatorOptions<T> {
    parse(str: string): T;
    format(value: T): string;
}

class QueryParameterFormatImpl<T> implements QueryParameterFormat<T | undefined> {
    constructor(
        private _options: QueryParameterFormatCreatorOptions<T>,
        private _required: boolean
    ) { }

    parse(str: string | undefined) {
        if (str === undefined) {
            if (this._required)
                throw new ArgumentError('Missing required parameter value.');
            return undefined;
        }
        return this._options.parse(str);
    }

    format(value: T | undefined) {
        if (value === undefined) {
            if (this._required)
                throw new ArgumentError('Missing required parameter value.');
            return undefined;
        }
        return this._options.format(value);
    }
}

export function createQueryParameterFormatCreator<T>(options: QueryParameterFormatCreatorOptions<T>) {
    return ((required: boolean): QueryParameterFormat<T | undefined> =>
        new QueryParameterFormatImpl(options, required)) as QueryParameterFormatCreator<T>;
}

export const stringQueryParameter = createQueryParameterFormatCreator<string>({
    parse: str => str,
    format: value => value
});

export const booleanQueryParameter = createQueryParameterFormatCreator<boolean>({
    parse: str => str !== 'false' && str !== '0',
    format: value => value ? 'true' : 'false'
});

export const integerQueryParameter = createQueryParameterFormatCreator<number>({
    parse: str => {
        if (!/^-?\d+/.test(str))
            throw new ArgumentError('Invalid parameter format');
        return parseInt(str);
    },
    format: value => {
        if (!Number.isInteger(value))
            throw new ArgumentError('Invalid parameter value');
        return value.toString();
    }
});

export function stringListQueryParameter(separator: string): QueryParameterFormat<string[]> {
    return {
        parse: str => str?.split(separator) ?? [],
        format: value => value.join(separator)
    };
}
