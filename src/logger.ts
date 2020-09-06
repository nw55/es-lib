import { AnyRecord, FatalError, LoggerStackTraceError, Mutable } from '@nw55/common';
import { LogMessage, LogWriter } from './common';
import { LogLevel } from './log-level';

type InforParams =
    | [message: string, details?: AnyRecord]
    | [message: string, code?: string, details?: AnyRecord];

function infoParamsToLogMessage(level: LogLevel, source: string | undefined, params: InforParams): LogMessage {
    const message = params[0];
    let code;
    let details;

    if (typeof params[1] === 'string') {
        code = params[1];
        details = params[2];
    }
    else {
        details = params[1];
    }

    return { level, source, message, code, details };
}

type ErrorParams =
    | [message: string, details?: AnyRecord]
    | [message: string, code?: string, details?: AnyRecord]
    | [error: Error, details?: AnyRecord]
    | [error: Error, code?: string, details?: AnyRecord]
    | [message: string, error: Error, details?: AnyRecord]
    | [message: string, error: Error, code?: string, details?: AnyRecord];

function errorParamsToLogMessage(level: LogLevel, source: string | undefined, params: ErrorParams): Mutable<LogMessage> {
    let message;
    let error;
    let code;
    let details;

    if (params[0] instanceof Error) {
        message = params[0].toString();
        error = params[0];
        if (typeof params[1] === 'string') {
            code = params[1];
            details = params[2];
        }
        else {
            details = params[1];
        }
    }
    else {
        message = params[0];
        if (typeof params[1] === 'string') {
            code = params[1];
            details = params[2];
        }
        else if (params[1] instanceof Error) {
            error = params[1];
            if (typeof params[2] === 'string') {
                code = params[2];
                details = params[3];
            }
            else {
                details = params[2];
            }
        }
        else {
            details = params[1];
        }
    }

    return { level, source, message, error, code, details };
}

export class Logger {
    private _logWriter: LogWriter | null;
    private _source: string | undefined;

    constructor(logWriter: LogWriter | null, source?: string) {
        this._logWriter = logWriter;
        this._source = source;
    }

    get logWriter() {
        return this._logWriter;
    }
    set logWriter(v: LogWriter | null) {
        this._logWriter = v;
    }

    get source() {
        return this._source;
    }
    set source(v: string | undefined) {
        this._source = v;
    }

    private _shouldLog(level: LogLevel) {
        return this._logWriter?.shouldLog(level, this._source) ?? false;
    }

    private _log(message: LogMessage) {
        this._logWriter?.log(message);
    }

    trace(...params: InforParams) {
        if (this._shouldLog(LogLevel.Trace)) {
            const message = infoParamsToLogMessage(LogLevel.Trace, this._source, params);
            this._log(message);
        }
    }

    verbose(...params: InforParams) {
        if (this._shouldLog(LogLevel.Verbose)) {
            const message = infoParamsToLogMessage(LogLevel.Verbose, this._source, params);
            this._log(message);
        }
    }

    debug(...params: InforParams) {
        if (this._shouldLog(LogLevel.Debug)) {
            const message = infoParamsToLogMessage(LogLevel.Debug, this._source, params);
            this._log(message);
        }
    }

    info(...params: InforParams) {
        if (this._shouldLog(LogLevel.Information)) {
            const message = infoParamsToLogMessage(LogLevel.Information, this._source, params);
            this._log(message);
        }
    }

    notice(...params: InforParams) {
        if (this._shouldLog(LogLevel.Notice)) {
            const message = infoParamsToLogMessage(LogLevel.Notice, this._source, params);
            this._log(message);
        }
    }

    warn(...params: ErrorParams) {
        if (this._shouldLog(LogLevel.Warning)) {
            const message = errorParamsToLogMessage(LogLevel.Warning, this._source, params);
            message.error ??= new LoggerStackTraceError(message.message);
            this._log(message);
        }
    }

    error(...params: ErrorParams) {
        if (this._shouldLog(LogLevel.Error)) {
            const message = errorParamsToLogMessage(LogLevel.Error, this._source, params);
            message.error ??= new LoggerStackTraceError(message.message);
            this._log(message);
        }
    }

    critical(...params: ErrorParams) {
        if (this._shouldLog(LogLevel.Critical)) {
            const message = errorParamsToLogMessage(LogLevel.Critical, this._source, params);
            message.error ??= new LoggerStackTraceError(message.message);
            this._log(message);
        }
    }

    fatal(...params: ErrorParams): never {
        const message = errorParamsToLogMessage(LogLevel.Fatal, this._source, params);
        if (this._shouldLog(LogLevel.Fatal)) {
            message.error ??= new LoggerStackTraceError(message.message);
            this._log(message);
        }
        throw new FatalError(message.message);
    }
}
