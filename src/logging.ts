export interface LogMessageOptions {
    readonly code?: string;
    readonly error?: Error;
    readonly details?: unknown;
}

interface LoggerMethods {
    trace(message: string, options?: LogMessageOptions): void;
    verbose(message: string, options?: LogMessageOptions): void;
    debug(message: string, options?: LogMessageOptions): void;
    info(message: string, options?: LogMessageOptions): void;
    notice(message: string, options?: LogMessageOptions): void;
    warn(message: string, options?: LogMessageOptions): void;
    error(message: string, options?: LogMessageOptions): void;
    critical(message: string, options?: LogMessageOptions): void;
    fatal(message: string, options?: LogMessageOptions): void;
}

export type LogLevelKeys = 'all' | keyof LoggerMethods;

export interface LogLevelInfo<TKey extends LogLevelKeys = LogLevelKeys> {
    readonly key: TKey;
    readonly value: number;
    readonly name: string;
    readonly symbol: string;
    readonly isError: boolean;
}

export interface LogMessage extends LogMessageOptions {
    readonly level: LogLevelInfo;
    readonly source?: string;
    readonly message: string;
}

export interface LogWriter {
    shouldLog(level: LogLevelInfo, source?: string): boolean;

    log(message: LogMessage): void;
}

export interface Logger extends LoggerMethods {
    shouldLog(level: LogLevelInfo | LogLevelKeys): boolean;
}

export interface LoggingProvider {
    shouldLog(level: LogLevelInfo | LogLevelKeys, source?: string): boolean;

    log(level: LogLevelInfo | LogLevelKeys, message: string, options?: LogMessageOptions): void;
}

export namespace LoggerProvider {
    const noopLoggingProvider: LoggingProvider = {
        shouldLog() { return false; },
        log() { }
    };

    let globalLoggingProvider = noopLoggingProvider;

    export function getGlobalLoggingProvider() {
        return globalLoggingProvider;
    }

    export function setGlobalLoggingProvider(loggingProvider: LoggingProvider | null) {
        globalLoggingProvider = loggingProvider ?? noopLoggingProvider;
    }

    class DefaultLogger implements Logger {
        private _source: string | undefined;

        constructor(source: string | undefined) {
            this._source = source;
        }

        shouldLog(level: LogLevelInfo | LogLevelKeys) {
            return globalLoggingProvider.shouldLog(level, this._source);
        }

        trace(message: string, options?: LogMessageOptions) {
            globalLoggingProvider.log('trace', message, options);
        }
        verbose(message: string, options?: LogMessageOptions) {
            globalLoggingProvider.log('verbose', message, options);
        }
        debug(message: string, options?: LogMessageOptions) {
            globalLoggingProvider.log('debug', message, options);
        }
        info(message: string, options?: LogMessageOptions) {
            globalLoggingProvider.log('info', message, options);
        }
        notice(message: string, options?: LogMessageOptions) {
            globalLoggingProvider.log('notice', message, options);
        }
        warn(message: string, options?: LogMessageOptions) {
            globalLoggingProvider.log('warn', message, options);
        }
        error(message: string, options?: LogMessageOptions) {
            globalLoggingProvider.log('error', message, options);
        }
        critical(message: string, options?: LogMessageOptions) {
            globalLoggingProvider.log('critical', message, options);
        }
        fatal(message: string, options?: LogMessageOptions) {
            globalLoggingProvider.log('fatal', message, options);
        }
    }

    export function getLogger(source?: string) {
        return new DefaultLogger(source);
    }
}
