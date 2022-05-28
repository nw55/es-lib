export type LogLevel =
    'trace' | 'debug' | 'debugAlert' | 'debugWarn' |
    'verbose' | 'info' | 'notice' | 'alert' |
    'warn' | 'error' | 'critical';
export type LogSource = string | readonly string[] | null;
export type LogMessageData = Record<string, unknown>; // should be JSON-serializable

export interface LogMessage {
    readonly scope?: string | undefined;
    readonly id?: string | undefined;
    readonly text?: string | undefined;
    readonly code?: string | undefined;
    readonly error?: Error | undefined;
    readonly data?: LogMessageData | undefined;
    readonly [key: symbol]: unknown;
}

export interface LoggingProvider {
    shouldLog(level: LogLevel, source: LogSource): boolean;

    log(level: LogLevel, source: LogSource, message: LogMessage): void;
}

export interface SimpleLogger {
    shouldLog(level: LogLevel): boolean;

    log(level: LogLevel, message: LogMessage): void;
}

export namespace LoggingProvider {
    const noopLoggingProvider: LoggingProvider = {
        shouldLog() { return false; },
        log() { }
    };

    let globalLoggingProvider = noopLoggingProvider;

    export function hasGlobalLoggingProvider() {
        return globalLoggingProvider !== noopLoggingProvider;
    }

    export function getGlobalLoggingProvider() {
        return globalLoggingProvider;
    }

    export function setGlobalLoggingProvider(loggingProvider: LoggingProvider | null) {
        globalLoggingProvider = loggingProvider ?? noopLoggingProvider;
    }

    export class SimpleLoggerImpl implements SimpleLogger {
        private _source: LogSource;

        constructor(source: LogSource) {
            this._source = source;
        }

        shouldLog(level: LogLevel) {
            return getGlobalLoggingProvider().shouldLog(level, this._source);
        }

        log(level: LogLevel, message: LogMessage) {
            getGlobalLoggingProvider().log(level, this._source, message);
        }
    }

    export const globalLogger: SimpleLogger = new SimpleLoggerImpl(null);

    export function getLogger(source: LogSource): SimpleLogger {
        return source === null ? globalLogger : new SimpleLoggerImpl(source);
    }
}
