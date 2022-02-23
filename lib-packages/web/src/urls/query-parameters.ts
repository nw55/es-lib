import { ArgumentError } from '@nw55/common';

export type QueryParameters = Record<string, QueryParameterFormat<any>>;

type QueryParamTypes<Params> = {
    [P in keyof Params]: Params[P] extends QueryParameterFormat<infer T> ? T : never;
};

type OptionalIfUndefined<T> =
    { [P in keyof T as undefined extends T[P] ? P : never]?: T[P]; }
    & { [P in keyof T as undefined extends T[P] ? never : P]: T[P]; };

type Simplify<T> = T extends object ? { [P in keyof T]: T[P]; } : T;

export type ResolveQueryParameterTypes<T extends QueryParameters> = Simplify<OptionalIfUndefined<QueryParamTypes<T>>>;

export interface QueryParameterFormat<T> {
    parse: (str: string | undefined) => T;
    format: (value: T) => string | undefined;
}

export interface QueryParameterFormatCreator<T> {
    (required: 'required'): QueryParameterFormat<T>;
    (optional: 'optional'): QueryParameterFormat<T | undefined>;
    (optional: 'optional', defaultValue: T): QueryParameterFormat<T>;
}

export interface QueryParameterFormatCreatorOptions<T> {
    validateDefaultValue?: (defaultValue: T) => boolean; // may throw specific error instead of returning false
    isDefaultValue?: (defaultValue: T) => boolean; // not needed if default value can be compared with ===
    parse: (str: string) => T;
    format: (value: T) => string;
}

class QueryParameterFormatImpl<T> implements QueryParameterFormat<T | undefined> {
    constructor(
        private _options: QueryParameterFormatCreatorOptions<T>,
        private _required: boolean,
        private _defaultValue: T | undefined
    ) { }

    private _isDefaultValue(value: T) {
        if (this._defaultValue === undefined)
            return false;
        if (this._options.isDefaultValue === undefined)
            return value === this._defaultValue;
        return this._options.isDefaultValue(value);
    }

    parse(str: string | undefined) {
        if (str === undefined) {
            if (this._required)
                throw new ArgumentError('Missing required parameter value.');
            return this._defaultValue;
        }
        return this._options.parse(str);
    }

    format(value: T | undefined) {
        if (value === undefined) {
            if (this._required)
                throw new ArgumentError('Missing required parameter value.');
            return undefined;
        }
        if (this._isDefaultValue(value))
            return undefined;
        return this._options.format(value);
    }
}

export function createQueryParameterFormatCreator<T>(options: QueryParameterFormatCreatorOptions<T>) {
    return ((requiredOrOptional: 'required' | 'optional', defaultValue?: T): QueryParameterFormat<T | undefined> => {
        if (defaultValue !== undefined && options.validateDefaultValue !== undefined && !options.validateDefaultValue(defaultValue))
            throw new ArgumentError('Invalid default value');
        return new QueryParameterFormatImpl(options, requiredOrOptional === 'required', defaultValue);
    }) as QueryParameterFormatCreator<T>;
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
    validateDefaultValue: value => Number.isInteger(value),
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
