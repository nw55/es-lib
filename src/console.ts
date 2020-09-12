import { LogMessage } from './common';
import { LogMessageWriter } from './message-writer';

type DetailsAndErrorParams =
    | [message: string, details?: unknown]
    | [message: string, error: Error, details?: unknown];

type ConsoleLogMessageWriterOptions = Readonly<{
    logErrors?: true;
    logDetails: true;
    writer: (...params: DetailsAndErrorParams) => void;
    errorWriter?: (...params: DetailsAndErrorParams) => void;
} | {
    logErrors?: true;
    logDetails?: false;
    writer: (message: string, error?: Error) => void;
    errorWriter?: (message: string, error?: Error) => void;
} | {
    logErrors: false;
    logDetails: true;
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
    private _logErrors: boolean;
    private _logDetails: boolean;

    constructor(options: ConsoleLogMessageWriterOptions) {
        this._writer = options.writer as UnsafeWriter;
        this._errorWriter = (options.errorWriter ?? options.writer) as UnsafeWriter;
        this._logErrors = options.logErrors ?? true;
        this._logDetails = options.logDetails ?? false;
    }

    writeMessage(text: string, message: LogMessage) {
        const writer = message.level.isError ? this._errorWriter : this._writer;

        if (this._logErrors && message.error !== undefined) {
            if (this._logDetails && message.details !== undefined)
                writer(text, message.error, message.details);
            else
                writer(text, message.error);
        }
        else if (this._logDetails && message.details !== undefined) {
            writer(text, message.details);
        }
        else {
            writer(text);
        }
    }
}
