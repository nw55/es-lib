import { LogMessage } from './common';
import { LogDetailsFormatter, LogErrorFormatter } from './details-formatter';
import { defaultLogFilter, LogFilter } from './filter';
import { LogMessageWriter } from './message-writer';

const asStringFormatter: LogDetailsFormatter = obj => String(obj);

export interface WritableLogMessageWriterOptions {
    readonly eol?: string;
    readonly logErrors?: boolean | LogFilter;
    readonly logDetails?: boolean | LogFilter;
    readonly errorFormatter?: LogErrorFormatter;
    readonly detailsFormatter?: LogDetailsFormatter;
}

interface Writable {
    write(data: string): void;
}

export class WritableLogMessageWriter implements LogMessageWriter {
    private _writable: Writable;
    private _eol: string;
    private _logErrors: LogFilter;
    private _logDetails: LogFilter;
    private _errorFormatter: LogErrorFormatter;
    private _detailsFormatter: LogDetailsFormatter;

    constructor(writable: Writable, options: WritableLogMessageWriterOptions = {}) {
        this._writable = writable;
        this._eol = options.eol ?? '\n';
        this._logErrors = defaultLogFilter(options.logErrors ?? true);
        this._logDetails = defaultLogFilter(options.logDetails ?? false);
        this._errorFormatter = options.errorFormatter ?? asStringFormatter;
        this._detailsFormatter = options.detailsFormatter ?? asStringFormatter;
    }

    writeMessage(text: string, message: LogMessage) {
        this._writable.write(text);
        this._writable.write(this._eol);

        if (message.error !== undefined && this._logErrors.shouldLogMessage(message)) {
            const errorString = this._errorFormatter(message.error, message);
            this._writable.write(errorString);
            this._writable.write(this._eol);
        }

        if (message.details !== undefined && this._logDetails.shouldLogMessage(message)) {
            const detailsString = this._detailsFormatter(message.details, message);
            this._writable.write(detailsString);
            this._writable.write(this._eol);
        }
    }
}
