import { LogMessage } from './common';
import { LogFilter } from './filter';
import { LogLevel } from './log-level';
import { LogMessageWriter } from './message-writer';

type DetailsAndErrorParams =
    | [message: string, details?: unknown]
    | [message: string, error: Error, details?: unknown];

type ConsoleLogMessageWriterOptions = Readonly<{
    logErrors?: true | LogFilter;
    logDetails: true | LogFilter;
    writer: (...params: DetailsAndErrorParams) => void;
    errorWriter?: (...params: DetailsAndErrorParams) => void;
} | {
    logErrors?: true | LogFilter;
    logDetails?: false;
    writer: (message: string, error?: Error) => void;
    errorWriter?: (message: string, error?: Error) => void;
} | {
    logErrors: false;
    logDetails: true | LogFilter;
    writer: (message: string, details?: unknown) => void;
    errorWriter?: (message: string, details?: unknown) => void;
} | {
    logErrors: false;
    logDetails?: false;
    writer: (message: string) => void;
    errorWriter?: (message: string) => void;
}>;

interface Console {
    log(text: string, ...args: unknown[]): void;
    error(text: string, ...args: unknown[]): void;
}

type UnsafeWriter = (text: string, ...args: unknown[]) => void;

const logNothingFilter: LogFilter = {
    shouldLog: () => false,
    shouldLogMessage: () => false
};

function getLogFilter(logFilter: LogFilter | boolean) {
    if (logFilter === true)
        return LogLevel.All;
    if (logFilter === false)
        return logNothingFilter;
    return logFilter;
}

export class ConsoleLogMessageWriter implements LogMessageWriter {
    static createDefault(console: Console, details: 'none' | 'errors' | 'details' | 'all' = 'errors') {
        return new ConsoleLogMessageWriter({
            writer: console.log.bind(console),
            errorWriter: console.error.bind(console),
            logErrors: details === 'errors' || details === 'all',
            logDetails: details === 'details' || details === 'all'
        });
    }

    private _writer: UnsafeWriter;
    private _errorWriter: UnsafeWriter;
    private _logErrors: LogFilter;
    private _logDetails: LogFilter;

    constructor(options: ConsoleLogMessageWriterOptions) {
        this._writer = options.writer as UnsafeWriter;
        this._errorWriter = (options.errorWriter ?? options.writer) as UnsafeWriter;
        this._logErrors = getLogFilter(options.logErrors ?? true);
        this._logDetails = getLogFilter(options.logDetails ?? false);
    }

    writeMessage(text: string, message: LogMessage) {
        const writer = message.level.isError ? this._errorWriter : this._writer;

        if (this._logErrors.shouldLogMessage(message) && message.error !== undefined) {
            if (this._logDetails.shouldLogMessage(message) && message.details !== undefined)
                writer(text, message.error, message.details);
            else
                writer(text, message.error);
        }
        else if (this._logDetails.shouldLogMessage(message) && message.details !== undefined) {
            writer(text, message.details);
        }
        else {
            writer(text);
        }
    }
}
