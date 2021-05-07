import { LoggingProvider } from '@nw55/common';
import { CombinedLogWriter } from './combined-log-writer';
import { LogWriter } from './common';
import { LogLevel } from './log-level';
import { Logger } from './logger';

export namespace Log {
    let globalLogWriter: LogWriter | null = null;

    export const proxyGlobalLogWriter: LogWriter = {
        shouldLog(level, source) {
            return LoggingProvider.getGlobalLoggingProvider().shouldLog(level, source);
        },
        log(message) {
            LoggingProvider.getGlobalLoggingProvider().log(message.level, message.source, message.message, message);
        }
    };

    export const global = new Logger(proxyGlobalLogWriter);

    export const loggingProvider: LoggingProvider = {
        shouldLog(level, source) {
            return globalLogWriter?.shouldLog(LogLevel.get(level), source) ?? false;
        },
        log(level, source, message, options) {
            globalLogWriter?.log({
                level: LogLevel.get(level),
                source,
                message,
                ...options
            });
        }
    };

    function register() {
        LoggingProvider.setGlobalLoggingProvider(loggingProvider);
    }

    export function getGlobalLogWriter() {
        return globalLogWriter;
    }

    export function setGlobalLogWriter(logWriter: LogWriter | null) {
        register();
        globalLogWriter = logWriter;
    }

    export function addGlobalLogWriter(writer: LogWriter) {
        register();
        globalLogWriter = CombinedLogWriter.addLogWriter(globalLogWriter, writer);
    }

    export function removeGlobalLogWriter(writer: LogWriter) {
        register();
        globalLogWriter = CombinedLogWriter.removeLogWriter(globalLogWriter, writer);
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    export function createLogger(source: string | Function) {
        if (typeof source === 'function')
            source = source.name;
        return new Logger(proxyGlobalLogWriter, source);
    }
}
