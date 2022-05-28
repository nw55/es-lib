import { LoggerStackTraceError, LogLevel, LogMessage, LogMessageData, LogSource } from '@nw55/common';
import { LogWriter } from './common';

type LogMethodParams =
    | [data: LogMessageData]
    | [text: string, data?: LogMessageData];

function paramsToMessage(params: LogMethodParams, error?: Error): LogMessage {
    let text;
    let data;
    if (typeof params[0] === 'string') {
        text = params[0];
        data = params[1];
    }
    else {
        data = params[0];
    }
    return { text, data, error };
}

type LogLevelMethods = Record<LogLevel, (...params: LogMethodParams) => void>;

export class Logger implements LogLevelMethods {
    private _logWriter: LogWriter | null;
    private _source: LogSource;

    constructor(logWriter: LogWriter | null, source: LogSource) {
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
    set source(v: LogSource) {
        this._source = v;
    }

    shouldLog(level: LogLevel) {
        if (this._logWriter === null)
            return false;
        return this._logWriter.shouldLog(level, this._source);
    }

    log(level: LogLevel, message: LogMessage) {
        if (this._logWriter === null)
            return;
        this._logWriter.log({
            level,
            source: this._source,
            timestamp: new Date(),
            message
        });
    }

    logError(level: LogLevel, error: unknown, text?: string) {
        let errorObject;
        if (error === undefined || error === null)
            errorObject = new LoggerStackTraceError(text);
        else if (error instanceof Error)
            errorObject = error;
        else
            errorObject = new Error((text === undefined ? '' : text + ': ') + String(error));
        this.log(level, {
            text: text ?? (errorObject.message === '' ? undefined : errorObject.message),
            error: errorObject
        });
    }

    trace(...params: LogMethodParams) {
        if (this.shouldLog('trace'))
            this.log('trace', paramsToMessage(params));
    }

    debug(...params: LogMethodParams) {
        if (this.shouldLog('debug'))
            this.log('debug', paramsToMessage(params));
    }

    verbose(...params: LogMethodParams) {
        if (this.shouldLog('verbose'))
            this.log('verbose', paramsToMessage(params));
    }

    info(...params: LogMethodParams) {
        if (this.shouldLog('info'))
            this.log('info', paramsToMessage(params));
    }

    debugAlert(...params: LogMethodParams) {
        if (this.shouldLog('debugAlert'))
            this.log('debugAlert', paramsToMessage(params));
    }

    notice(...params: LogMethodParams) {
        if (this.shouldLog('notice'))
            this.log('notice', paramsToMessage(params));
    }

    alert(...params: LogMethodParams) {
        if (this.shouldLog('alert'))
            this.log('alert', paramsToMessage(params));
    }

    debugWarn(...params: LogMethodParams) {
        if (this.shouldLog('debugWarn'))
            this.log('debugWarn', paramsToMessage(params, new LoggerStackTraceError()));
    }

    warn(...params: LogMethodParams) {
        if (this.shouldLog('warn'))
            this.log('warn', paramsToMessage(params, new LoggerStackTraceError()));
    }

    error(...params: LogMethodParams) {
        if (this.shouldLog('error'))
            this.log('error', paramsToMessage(params, new LoggerStackTraceError()));
    }

    critical(...params: LogMethodParams) {
        if (this.shouldLog('critical'))
            this.log('critical', paramsToMessage(params, new LoggerStackTraceError()));
    }
}
