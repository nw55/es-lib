import { ArgumentError } from '@nw55/common';
import { LogMessage } from './common';

export type LogFormat = (message: LogMessage) => string;

type LogFormatPlaceholder = keyof typeof knownLogFormats | LogFormat;

function placeholderLogFormat(placeholder: LogFormatPlaceholder): LogFormat {
    if (typeof placeholder === 'string')
        return knownLogFormats[placeholder];
    return placeholder;
}

function concatenatedLogFormat(segments: LogFormat[]): LogFormat {
    return message => segments.map(segment => segment(message)).join('');
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

// eslint-disable-next-line no-redeclare -- merging function and namespace
export namespace logFormat {
    const datePad = (v: number) => v < 10 ? '0' + String(v) : String(v);

    const isoDateFormat: LogFormat = () => {
        const now = new Date();
        return `${now.getUTCFullYear()}-${datePad(now.getUTCMonth() + 1)}-${datePad(now.getUTCDate())}`;
    };
    const localeDateFormat: LogFormat = () => new Date().toLocaleDateString();
    const unixDateFormat: LogFormat = () => Date.now().toString();

    const isoTimeFormat: LogFormat = () => {
        const now = new Date();
        return `${datePad(now.getUTCHours())}:${datePad(now.getUTCMinutes())}:${datePad(now.getUTCSeconds())}.${(now.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5)}`;
    };
    const localeTimeFormat: LogFormat = () => new Date().toLocaleTimeString();

    const isoDateTimeFormat: LogFormat = () => new Date().toISOString();
    const localeDateTimeFormat: LogFormat = () => new Date().toLocaleString();

    export function date(format: 'iso' | 'locale' | 'unix' = 'iso'): LogFormat {
        switch (format) {
            case 'iso':
                return isoDateFormat;
            case 'locale':
                return localeDateFormat;
            case 'unix':
                return unixDateFormat;
        }
        throw new ArgumentError();
    }

    export function time(format: 'iso' | 'locale' = 'iso'): LogFormat {
        switch (format) {
            case 'iso':
                return isoTimeFormat;
            case 'locale':
                return localeTimeFormat;
        }
        throw new ArgumentError();
    }

    export function dateTime(format: 'iso' | 'locale' = 'iso'): LogFormat {
        switch (format) {
            case 'iso':
                return isoDateTimeFormat;
            case 'locale':
                return localeDateTimeFormat;
        }
        throw new ArgumentError();
    }

    const levelKeyFormat: LogFormat = message => message.level.key;
    const levelNameFormat: LogFormat = message => message.level.name;
    const levelSymbolFormat: LogFormat = message => message.level.symbol;

    export function level(format: 'key' | 'name' | 'symbol' = 'key'): LogFormat {
        switch (format) {
            case 'key':
                return levelKeyFormat;
            case 'name':
                return levelNameFormat;
            case 'symbol':
                return levelSymbolFormat;
        }
        throw new ArgumentError();
    }

    export function sourceOrDefault(defaultSource = ''): LogFormat {
        return message => message.source ?? defaultSource;
    }

    export function sourceFormat(format = '%', placeholder = '%'): LogFormat {
        return message => message.source === undefined ? '' : format.replace(placeholder, message.source);
    }

    export const detailsString: LogFormat = message => String(message.details);

    // eslint-disable-next-line no-shadow
    export const message: LogFormat = message => message.message;

    export function literal(text: string): LogFormat {
        return () => text;
    }
}

const knownLogFormats = {
    date: logFormat.date(),
    time: logFormat.time(),
    datetime: logFormat.dateTime(),
    level: logFormat.level(),
    source: logFormat.sourceOrDefault(),
    details: logFormat.detailsString,
    message: logFormat.message
};
