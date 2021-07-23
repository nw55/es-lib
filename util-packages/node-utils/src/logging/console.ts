import { ConsoleLogMessageWriter, DefaultLogWriter, Log, LogFilter, logFormat, LogFormat, LogMessageWriter, TransformedLogMessageWriter } from '@nw55/logging';

type ColorStyler<K extends string> = {
    [P in K]: ColorStyler<K> & ((text: string) => string);
};

type DefaultColorStyler = ColorStyler<'gray' | 'cyanBright' | 'whiteBright' | 'greenBright' | 'yellowBright' | 'redBright' | 'red' | 'bgWhiteBright'>;

function useColorStyler(baseWriter: LogMessageWriter, colorStyler?: DefaultColorStyler) {
    if (colorStyler === undefined)
        return baseWriter;

    return TransformedLogMessageWriter.byLevel(baseWriter, {
        all: text => colorStyler.gray(text),
        debug: text => colorStyler.whiteBright(text),
        info: text => colorStyler.cyanBright(text),
        notice: text => colorStyler.greenBright(text),
        warn: text => colorStyler.yellowBright(text),
        error: text => colorStyler.redBright(text),
        critical: text => colorStyler.bgWhiteBright.red(text)
    });
}

export const defaultConsoleLogFormat = logFormat`${'datetime'} ${'level'} [${'source'}]${logFormat.codeFormat(' %')}: ${'message'}`;

export interface ConsoleLogWriterOptions {
    readonly filter?: LogFilter;
    readonly format?: LogFormat;
    readonly logErrors?: boolean | LogFilter;
    readonly logDetails?: boolean | LogFilter;
    readonly colorStyler?: DefaultColorStyler;
}

export function createConsoleLogWriter(options: ConsoleLogWriterOptions) {
    const messageWriter = new ConsoleLogMessageWriter({
        writer: console.log.bind(console), // eslint-disable-line no-console
        errorWriter: console.error.bind(console), // eslint-disable-line no-console
        logDetails: options.logDetails,
        logErrors: options.logErrors
    });

    return new DefaultLogWriter({
        filter: options.filter,
        format: options.format ?? defaultConsoleLogFormat,
        messageWriter: useColorStyler(messageWriter, options.colorStyler)
    });
}

export function useDefaultConsoleLogging(filter?: LogFilter) {
    Log.addGlobalLogWriter(createConsoleLogWriter({ filter }));
}
