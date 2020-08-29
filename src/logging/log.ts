import { Logger } from './logger';
import { CombinedLogWriter, LogWriter } from './shared';

const noopLogWriter: LogWriter = {
    shouldLog() { return false; },
    log() { }
};

export namespace Log {
    let globalLogWriter = noopLogWriter;

    export const proxyGlobalLogWriter: LogWriter = {
        shouldLog: level => globalLogWriter.shouldLog(level),
        log: message => globalLogWriter.log(message)
    };

    export const global = new Logger(proxyGlobalLogWriter);

    export function getGlobalLogWriter() {
        return globalLogWriter;
    }

    export function setGlobalLogWriter(logWriter: LogWriter | null) {
        globalLogWriter = logWriter ?? noopLogWriter;
    }

    export function addGlobalLogWriter(writer: LogWriter) {
        globalLogWriter = new CombinedLogWriter(globalLogWriter, writer);
    }

    export function removeGlobalLogWriter(writer: LogWriter) {
        if (globalLogWriter === writer) {
            globalLogWriter = noopLogWriter;
        }
        else if (globalLogWriter instanceof CombinedLogWriter) {
            if (writer instanceof CombinedLogWriter) {
                const writersToRemove = new Set(writer.writers);
                const writersToRetain = globalLogWriter.writers.filter(w => !writersToRemove.has(w));
                globalLogWriter = new CombinedLogWriter(...writersToRetain);
            }
            else {
                const writersToRetain = globalLogWriter.writers.filter(w => w !== writer);
                globalLogWriter = new CombinedLogWriter(...writersToRetain);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    export function createLogger(source: string | Function) {
        if (typeof source === 'function')
            source = source.name;
        return new Logger(proxyGlobalLogWriter, source);
    }
}
