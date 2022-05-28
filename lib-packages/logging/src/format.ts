import { ArgumentError, isArray } from '@nw55/common';
import { LogEntry } from './common';
import { logLevelMetadata } from './log-level-metadata';

export type LogFormat = (entry: LogEntry) => string;

type LogFormatPlaceholder = keyof typeof knownLogFormats | LogFormat;

function placeholderLogFormat(placeholder: LogFormatPlaceholder): LogFormat {
    if (typeof placeholder === 'string')
        return knownLogFormats[placeholder];
    return placeholder;
}

function concatenatedLogFormat(segments: LogFormat[]): LogFormat {
    return entry => segments.map(segment => segment(entry)).join('');
}

export function logFormat(strings: TemplateStringsArray, ...placeholders: LogFormatPlaceholder[]): LogFormat {
    const segments: LogFormat[] = [];
    for (let i = 0; i < strings.length; i++) {
        if (i !== 0)
            segments.push(placeholderLogFormat(placeholders[i - 1]));
        if (strings[i] !== '')
            segments.push(logFormat.literal(strings[i]));
    }
    return concatenatedLogFormat(segments);
}

export namespace logFormat {
    const datePad = (v: number) => v < 10 ? '0' + String(v) : String(v);

    const isoDateFormat: LogFormat = entry => `${entry.timestamp.getUTCFullYear()}-${datePad(entry.timestamp.getUTCMonth() + 1)}-${datePad(entry.timestamp.getUTCDate())}`;
    const localeDateFormat: LogFormat = entry => entry.timestamp.toLocaleDateString();
    const unixDateFormat: LogFormat = entry => entry.timestamp.getTime().toFixed(0);

    const isoTimeFormat: LogFormat = entry => `${datePad(entry.timestamp.getUTCHours())}:${datePad(entry.timestamp.getUTCMinutes())}:${datePad(entry.timestamp.getUTCSeconds())}.${(entry.timestamp.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5)}`;
    const localeTimeFormat: LogFormat = entry => entry.timestamp.toLocaleTimeString();

    const isoDateTimeFormat: LogFormat = entry => entry.timestamp.toISOString();
    const localeDateTimeFormat: LogFormat = entry => entry.timestamp.toLocaleString();

    export function date(format: 'iso' | 'locale' | 'unix' = 'iso'): LogFormat {
        switch (format) {
            case 'iso':
                return isoDateFormat;
            case 'locale':
                return localeDateFormat;
            case 'unix':
                return unixDateFormat;
        }
    }

    export function time(format: 'iso' | 'locale' = 'iso'): LogFormat {
        switch (format) {
            case 'iso':
                return isoTimeFormat;
            case 'locale':
                return localeTimeFormat;
        }
    }

    export function dateTime(format: 'iso' | 'locale' = 'iso'): LogFormat {
        switch (format) {
            case 'iso':
                return isoDateTimeFormat;
            case 'locale':
                return localeDateTimeFormat;
        }
    }

    const levelKeyFormat: LogFormat = entry => entry.level;
    const levelNameFormat: LogFormat = entry => logLevelMetadata[entry.level].name;
    const levelSymbolFormat: LogFormat = entry => logLevelMetadata[entry.level].symbol;

    export function level(format: 'key' | 'name' | 'symbol' = 'key'): LogFormat {
        switch (format) {
            case 'key':
                return levelKeyFormat;
            case 'name':
                return levelNameFormat;
            case 'symbol':
                return levelSymbolFormat;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    function formatSource(source: readonly string[] | string, separator: string) {
        if (isArray(source))
            return source.join(separator);
        return source;
    }

    export function source(separator = '/', defaultSource = ''): LogFormat {
        return entry => entry.source === null ? defaultSource : formatSource(entry.source, separator);
    }

    export function sourceFormat(format: string, placeholder = '%', separator = '/', defaultSource = ''): LogFormat {
        return entry => entry.source === null ? defaultSource : format.replace(placeholder, formatSource(entry.source, separator));
    }

    export function id(defaultId = ''): LogFormat {
        return entry => entry.message.id ?? defaultId;
    }

    export function idFormat(format: string, placeholder = '%', defaultId = ''): LogFormat {
        return entry => entry.message.id === undefined ? defaultId : format.replace(placeholder, entry.message.id);
    }

    export function scope(defaultScope = ''): LogFormat {
        return entry => entry.message.scope ?? defaultScope;
    }

    export function scopeFormat(format: string, placeholder = '%', defaultScope = ''): LogFormat {
        return entry => entry.message.scope === undefined ? defaultScope : format.replace(placeholder, entry.message.scope);
    }

    export function code(defaultCode = ''): LogFormat {
        return entry => entry.message.code ?? defaultCode;
    }

    export function codeFormat(format: string, placeholder = '%', defaultCode = ''): LogFormat {
        return entry => entry.message.code === undefined ? defaultCode : format.replace(placeholder, entry.message.code);
    }

    const errorNameFormat: LogFormat = entry => entry.message.error?.name ?? '';
    const errorMessageFormat: LogFormat = entry => entry.message.error?.message ?? '';
    const errorNameAndMessageFormat: LogFormat = entry => entry.message.error === undefined ? '' : `${entry.message.error.name}: ${entry.message.error.message}`;

    export function error(format: 'name' | 'message' | 'name-and-message' = 'name-and-message'): LogFormat {
        switch (format) {
            case 'name':
                return errorNameFormat;
            case 'message':
                return errorMessageFormat;
            case 'name-and-message':
                return errorNameAndMessageFormat;
        }
    }

    export const dataString: LogFormat = entry => entry.message.data === undefined ? '{}' : JSON.stringify(entry.message.data);

    export const text: LogFormat = entry => entry.message.text ?? '';

    export function literal(value: string): LogFormat {
        return () => value;
    }

    export function fixedWidth(innerFormat: LogFormatPlaceholder, width: number, align: 'left' | 'right' = 'left', cutoff: 'left' | 'right' = 'right', padding = ' '): LogFormat {
        if (width <= 0)
            throw new ArgumentError();
        const innerFormatResolved = placeholderLogFormat(innerFormat);
        return entry => {
            const inner = innerFormatResolved(entry);
            if (inner.length === width)
                return inner;
            if (inner.length > width) {
                if (cutoff === 'right')
                    return inner.slice(0, width);
                return inner.slice(inner.length - width);
            }
            if (align === 'left')
                return inner.padEnd(width, padding);
            return inner.padStart(width, padding);
        };
    }
}

const knownLogFormats = {
    date: logFormat.date(),
    time: logFormat.time(),
    datetime: logFormat.dateTime(),
    level: logFormat.level(),
    source: logFormat.source(),
    scope: logFormat.scope(),
    id: logFormat.id(),
    code: logFormat.code(),
    error: logFormat.error(),
    data: logFormat.dataString,
    text: logFormat.text
};
