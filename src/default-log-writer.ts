import { LogMessage, LogWriter } from './common';
import { LogFilter } from './filter';
import { LogFormat, logFormat } from './format';
import { LogLevel } from './log-level';
import { LogMessageWriter } from './message-writer';

export interface DefaultLogWriterOptions {
    readonly filter?: LogFilter;
    readonly format?: LogFormat;
    readonly messageWriter: LogMessageWriter;
}

const noopFilter: LogFilter = {
    shouldLog: () => false,
    shouldLogMessage: () => false
};

export class DefaultLogWriter implements LogWriter {
    private _filter: LogFilter;
    private _format: LogFormat;
    private _messageWriter: LogMessageWriter;

    constructor(options: DefaultLogWriterOptions) {
        this._filter = options.filter ?? noopFilter;
        this._format = options.format ?? logFormat.message;
        this._messageWriter = options.messageWriter;
    }

    shouldLog(level: LogLevel, source?: string) {
        return this._filter.shouldLog(level, source);
    }

    log(message: LogMessage) {
        if (this._filter.shouldLogMessage(message)) {
            const text = this._format(message);
            this._messageWriter.writeMessage(text, message);
        }
    }
}
