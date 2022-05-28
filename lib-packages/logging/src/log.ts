import { isArray, LoggingProvider } from '@nw55/common';
import { CombinedLogWriter } from './combined-log-writer';
import { LogWriter } from './common';
import { Logger } from './logger';

let globalLogWriter: LogWriter | null = null;

const loggingProvider: LoggingProvider = {
    shouldLog(level, source) {
        if (globalLogWriter === null)
            return false;
        return globalLogWriter.shouldLog(level, source);
    },
    log(level, source, message) {
        if (globalLogWriter === null)
            return;
        globalLogWriter.log({
            level,
            source,
            timestamp: new Date(),
            message
        });
    }
};

const proxyGlobalLogWriter: LogWriter = {
    shouldLog(level, source) {
        const globalLoggingProvider = LoggingProvider.getGlobalLoggingProvider();
        if (globalLoggingProvider === loggingProvider) {
            if (globalLogWriter === null)
                return false;
            return globalLogWriter.shouldLog(level, source);
        }
        return globalLoggingProvider.shouldLog(level, source);
    },
    log(entry) {
        const globalLoggingProvider = LoggingProvider.getGlobalLoggingProvider();
        if (globalLoggingProvider === loggingProvider) {
            if (globalLogWriter === null)
                return;
            globalLogWriter.log(entry);
            return;
        }
        globalLoggingProvider.log(entry.level, entry.source, entry.message);
    }
};

function registerGlobalLogging() {
    LoggingProvider.setGlobalLoggingProvider(loggingProvider);
}

function registerGlobalLoggingIfNeeded(force: boolean) {
    if (force || !LoggingProvider.hasGlobalLoggingProvider())
        registerGlobalLogging();
}

export class GlobalLogger extends Logger {
    get globalLogWriter() {
        return globalLogWriter;
    }

    register() {
        registerGlobalLogging();
    }

    setGlobalLogWriter(logWriter: LogWriter | null, forceRegister = false) {
        registerGlobalLoggingIfNeeded(forceRegister);
        globalLogWriter = logWriter;
    }

    addGlobalLogWriter(writer: LogWriter, forceRegister = false) {
        registerGlobalLoggingIfNeeded(forceRegister);
        globalLogWriter = CombinedLogWriter.addLogWriter(globalLogWriter, writer);
    }

    removeGlobalLogWriter(writer: LogWriter, forceRegister = false) {
        registerGlobalLoggingIfNeeded(forceRegister);
        globalLogWriter = CombinedLogWriter.removeLogWriter(globalLogWriter, writer);
    }

    createLogger(source: string, separator?: string): Logger;
    createLogger(source: string[]): Logger;
    createLogger(source: string | string[], separator = '/') {
        const resolvedSource = isArray(source) ? source : source.split(separator);
        return new Logger(proxyGlobalLogWriter, resolvedSource);
    }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Log = new GlobalLogger(proxyGlobalLogWriter, null);
