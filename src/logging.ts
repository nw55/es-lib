export interface LogDetails {
    readonly code?: string;
    readonly error?: Error;
    readonly details?: unknown;
}

interface LoggerMethods {
    trace(message: string, options?: LogDetails): void;
    verbose(message: string, options?: LogDetails): void;
    debug(message: string, options?: LogDetails): void;
    info(message: string, options?: LogDetails): void;
    notice(message: string, options?: LogDetails): void;
    warn(message: string, options?: LogDetails): void;
    error(message: string, options?: LogDetails): void;
    critical(message: string, options?: LogDetails): void;
    fatal(message: string, options?: LogDetails): void;
}

export type LogLevelKeys = 'all' | keyof LoggerMethods;

export interface LogLevelInfo<TKey extends LogLevelKeys = LogLevelKeys> {
    readonly key: TKey;
}

export interface Logger extends LoggerMethods {
    shouldLog(level: LogLevelInfo | LogLevelKeys): boolean;
}

export interface LoggingProvider {
    shouldLog(level: LogLevelInfo | LogLevelKeys, source?: string): boolean;

    log(level: LogLevelInfo | LogLevelKeys, source: string | undefined, message: string, options?: LogDetails): void;
}

export namespace LoggingProvider {
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

        trace(message: string, options?: LogDetails) {
            globalLoggingProvider.log('trace', this._source, message, options);
        }
        verbose(message: string, options?: LogDetails) {
            globalLoggingProvider.log('verbose', this._source, message, options);
        }
        debug(message: string, options?: LogDetails) {
            globalLoggingProvider.log('debug', this._source, message, options);
        }
        info(message: string, options?: LogDetails) {
            globalLoggingProvider.log('info', this._source, message, options);
        }
        notice(message: string, options?: LogDetails) {
            globalLoggingProvider.log('notice', this._source, message, options);
        }
        warn(message: string, options?: LogDetails) {
            globalLoggingProvider.log('warn', this._source, message, options);
        }
        error(message: string, options?: LogDetails) {
            globalLoggingProvider.log('error', this._source, message, options);
        }
        critical(message: string, options?: LogDetails) {
            globalLoggingProvider.log('critical', this._source, message, options);
        }
        fatal(message: string, options?: LogDetails) {
            globalLoggingProvider.log('fatal', this._source, message, options);
        }
    }

    export function getLogger(source?: string) {
        return new DefaultLogger(source);
    }
}
