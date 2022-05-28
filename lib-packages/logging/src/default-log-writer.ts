import { LogLevel, LogSource } from '@nw55/common';
import { LogEntry, LogWriter } from './common';
import { createLogFilter, LogFilter, LogFilterResolvable } from './filter';
import { LogFormat, logFormat } from './format';
import { LogTextWriter } from './log-text-writer';

export interface DefaultLogWriterOptions {
    readonly filter?: LogFilterResolvable | undefined;
    readonly format?: LogFormat | undefined;
    readonly textWriter: LogTextWriter;
}

export class DefaultLogWriter implements LogWriter {
    private _filter: LogFilter;
    private _format: LogFormat;
    private _textWriter: LogTextWriter;

    constructor(options: DefaultLogWriterOptions) {
        this._filter = createLogFilter(options.filter ?? true);
        this._format = options.format ?? logFormat.text;
        this._textWriter = options.textWriter;
    }

    shouldLog(level: LogLevel, source: LogSource) {
        return this._filter.shouldLog(level, source);
    }

    log(entry: LogEntry) {
        if (this._filter.shouldLogEntry(entry)) {
            const text = this._format(entry);
            this._textWriter.writeEntry(text, entry);
        }
    }
}
