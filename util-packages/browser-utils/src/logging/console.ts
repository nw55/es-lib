import { LogLevel } from '@nw55/common';
import { createLogFilter, DefaultLogWriter, Log, LogEntry, LogFilter, LogFilterResolvable, logFormat, LogFormat, LogTextWriter } from '@nw55/logging';

const logFunctions: Record<LogLevel, 'debug' | 'info' | 'log' | 'warn' | 'error'> = {
    trace: 'debug',
    debug: 'debug',
    verbose: 'info',
    info: 'info',
    notice: 'log',
    alert: 'log',
    debugAlert: 'log',
    debugWarn: 'warn',
    warn: 'warn',
    error: 'error',
    critical: 'error'
};

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
        const logFn = logFunctions[entry.level];

        const shouldLogError = entry.message.error !== undefined && this._logErrors.shouldLogEntry(entry);
        const shouldLogData = entry.message.data !== undefined && this._logData.shouldLogEntry(entry);

        /* eslint-disable no-console */
        if (shouldLogError) {
            if (shouldLogData)
                console[logFn](text, entry.message.error, entry.message.data);
            else
                console[logFn](text, entry.message.error);
        }
        else if (shouldLogData) {
            console[logFn](text, entry.message.data);
        }
        else {
            console[logFn](text);
        }
        /* eslint-enable no-console */
    }
}

export const defaultConsoleLogFormat = logFormat`${logFormat.level('symbol')} [${logFormat.fixedWidth('source', 16)}] ${'text'}${logFormat.codeFormat(' [%]')}`;

export interface ConsoleLogWriterOptions extends ConsoleLogTextWriterOptions {
    readonly filter?: LogFilter | undefined;
    readonly format?: LogFormat | undefined;
}

export function createConsoleLogWriter(options: ConsoleLogWriterOptions) {
    const textWriter = new ConsoleLogTextWriter({
        logErrors: options.logErrors,
        logData: options.logData
    });

    return new DefaultLogWriter({
        filter: options.filter,
        format: options.format ?? defaultConsoleLogFormat,
        textWriter
    });
}

export function useDefaultConsoleLogging(filter?: LogFilter) {
    Log.addGlobalLogWriter(createConsoleLogWriter({ filter }));
}
