import { ApiError } from './common';

export interface ApiParameterFormat<T> {
    parse: (str: string | undefined) => T;
    format: (value: T) => string | undefined;
}

export namespace ApiParameter {
    export const optionalString: ApiParameterFormat<string | undefined> = {
        parse: str => str,
        format: value => value
    };

    export function string(defaultValue?: string): ApiParameterFormat<string> {
        return {
            parse(str) {
                if (str === undefined) {
                    if (defaultValue === undefined)
                        throw new ApiError(400, 'Missing required parameter.');
                    return defaultValue;
                }
                return str;
            },
            format(value) {
                if (value === defaultValue)
                    return undefined;
                return value;
            }
        };
    }

    export const boolean: ApiParameterFormat<boolean | undefined> = {
        parse(str) {
            if (str === 'false' || str === '0')
                return false;
            return true;
        },
        format(value) {
            return value === true ? 'true' : 'false';
        }
    };

    export const optionalNumber: ApiParameterFormat<number | undefined> = {
        parse(str) {
            if (str === undefined)
                return undefined;
            return Number(str);
        },
        format(value) {
            if (value === undefined)
                return undefined;
            return String(value);
        }
    };

    export function number(defaultValue?: number): ApiParameterFormat<number> {
        return {
            parse(str) {
                if (str === undefined) {
                    if (defaultValue === undefined)
                        throw new ApiError(400, 'Missing required parameter.');
                    return defaultValue;
                }
                return Number(str);
            },
            format(value) {
                if (value === defaultValue)
                    return undefined;
                return String(value);
            }
        };
    }

    export function strings(separator: string): ApiParameterFormat<string[]> {
        return {
            parse(str) {
                return str?.split(separator) ?? [];
            },
            format(value) {
                return value.join(separator);
            }
        };
    }
}
