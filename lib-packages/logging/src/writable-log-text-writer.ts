import type { LogMessageData } from '@nw55/common';
import type { LogEntry } from './common.js';
import { createLogFilter, type LogFilter, type LogFilterResolvable } from './filter.js';
import type { LogTextWriter } from './log-text-writer.js';

export type LogErrorFormatter = (error: Error, entry: LogEntry) => string;

export type LogDataFormatter = (data: LogMessageData, entry: LogEntry) => string;

const errorStringFormatter: LogErrorFormatter = error => String(error);

const dataJsonFormatter: LogDataFormatter = data => JSON.stringify(data);

export interface WritableLogMessageWriterOptions {
    readonly eol?: string | undefined;
    readonly logErrors?: LogFilterResolvable | undefined;
    readonly logData?: LogFilterResolvable | undefined;
    readonly errorFormatter?: LogErrorFormatter | undefined;
    readonly dataFormatter?: LogDataFormatter | undefined;
}

interface Writable {
    write(data: string): void;
}

export class WritableLogTextWriter implements LogTextWriter {
    private _writable: Writable;
    private _eol: string;
    private _logErrors: LogFilter;
    private _logData: LogFilter;
    private _errorFormatter: LogErrorFormatter;
    private _dataFormatter: LogDataFormatter;

    constructor(writable: Writable, options: WritableLogMessageWriterOptions = {}) {
        this._writable = writable;
        this._eol = options.eol ?? '\n';
        this._logErrors = createLogFilter(options.logErrors ?? true);
        this._logData = createLogFilter(options.logData ?? false);
        this._errorFormatter = options.errorFormatter ?? errorStringFormatter;
        this._dataFormatter = options.dataFormatter ?? dataJsonFormatter;
    }

    writeEntry(text: string, entry: LogEntry) {
        this._writable.write(text);
        this._writable.write(this._eol);

        if (entry.message.error !== undefined && this._logErrors.shouldLogEntry(entry)) {
            const errorString = this._errorFormatter(entry.message.error, entry);
            this._writable.write(errorString);
            this._writable.write(this._eol);
        }

        if (entry.message.data !== undefined && this._logData.shouldLogEntry(entry)) {
            const dataString = this._dataFormatter(entry.message.data, entry);
            this._writable.write(dataString);
            this._writable.write(this._eol);
        }
    }
}
