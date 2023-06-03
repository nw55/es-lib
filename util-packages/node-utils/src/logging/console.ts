import { DefaultLogWriter, Log, TransformedLogTextWriter, createLogFilter, logFormat, logLevelMetadata, type LogEntry, type LogFilter, type LogFilterResolvable, type LogFormat, type LogTextWriter } from '@nw55/logging';

export interface ConsoleLogTextWriterOptions {
    readonly logErrors?: LogFilterResolvable | undefined;
    readonly logData?: LogFilterResolvable | undefined;
}

export class ConsoleLogTextWriter implements LogTextWriter {
    private _logErrors: LogFilter;
    private _logData: LogFilter;

    constructor(options: ConsoleLogTextWriterOptions) {
        this._logErrors = createLogFilter(options.logErrors ?? true);
        this._logData = createLogFilter(options.logData ?? false);
    }

    writeEntry(text: string, entry: LogEntry) {
        const writeFn = logLevelMetadata[entry.level].isError ? 'error' : 'log';

        const shouldLogError = entry.message.error !== undefined && this._logErrors.shouldLogEntry(entry);
        const shouldLogData = entry.message.data !== undefined && this._logData.shouldLogEntry(entry);

        /* eslint-disable no-console */
        if (shouldLogError) {
            if (shouldLogData)
                console[writeFn](text, entry.message.error, entry.message.data);
            else
                console[writeFn](text, entry.message.error);
        }
        else if (shouldLogData) {
            console[writeFn](text, entry.message.data);
        }
        else {
            console[writeFn](text);
        }
        /* eslint-enable no-console */
    }
}

type ColorStyler<K extends string> = {
    [P in K]: ColorStyler<K> & ((text: string) => string);
};

type DefaultColorStyler = ColorStyler<'black' | 'gray' | 'cyanBright' | 'whiteBright' | 'greenBright' | 'green' | 'yellowBright' | 'redBright' | 'red' | 'bgWhiteBright'>;

function useDefaultColorStyler(baseWriter: LogTextWriter, colorStyler?: DefaultColorStyler) {
    if (colorStyler === undefined)
        return baseWriter;

    return TransformedLogTextWriter.byLevel(baseWriter, {
        trace: text => colorStyler.gray(text),
        verbose: text => colorStyler.whiteBright(text),
        info: text => colorStyler.cyanBright(text),
        notice: text => colorStyler.greenBright(text),
        alert: text => colorStyler.bgWhiteBright.green(text),
        debugAlert: text => colorStyler.bgWhiteBright.black(text),
        debugWarn: text => colorStyler.yellowBright(text),
        warn: text => colorStyler.yellowBright(text),
        error: text => colorStyler.redBright(text),
        critical: text => colorStyler.bgWhiteBright.red(text)
    });
}

export const defaultConsoleLogFormat = logFormat`${'datetime'} ${logFormat.level('symbol')} [${logFormat.fixedWidth('source', 16)}] ${'text'}${logFormat.codeFormat(' [%]')}`;

export interface ConsoleLogWriterOptions extends ConsoleLogTextWriterOptions {
    readonly filter?: LogFilterResolvable | undefined;
    readonly format?: LogFormat | undefined;
    readonly colorStyler?: DefaultColorStyler | undefined;
}

export function createConsoleLogWriter(options: ConsoleLogWriterOptions) {
    const textWriter = new ConsoleLogTextWriter({
        logErrors: options.logErrors,
        logData: options.logData
    });

    return new DefaultLogWriter({
        filter: options.filter,
        format: options.format ?? defaultConsoleLogFormat,
        textWriter: useDefaultColorStyler(textWriter, options.colorStyler)
    });
}

export function useDefaultConsoleLogging(filter?: LogFilterResolvable) {
    Log.addGlobalLogWriter(createConsoleLogWriter({ filter }));
}
