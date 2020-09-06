import { LogMessage, LogWriter } from './common';
import { LogLevel } from './log-level';

export class CombinedLogWriter implements LogWriter {
    static addLogWriter(logWriter: LogWriter | null, add: LogWriter) {
        if (logWriter === null)
            return add;
        return new CombinedLogWriter([logWriter, add]);
    }

    static removeLogWriter(logWriter: LogWriter | null, remove: LogWriter) {
        if (logWriter === remove)
            return null;

        if (!(logWriter instanceof CombinedLogWriter))
            return logWriter;

        if (remove instanceof CombinedLogWriter) {
            const writersToRemove = new Set(remove.writers);
            const writersToRetain = logWriter.writers.filter(w => !writersToRemove.has(w));
            return new CombinedLogWriter(writersToRetain);
        }

        const writersToRetain = logWriter.writers.filter(w => w !== remove);
        return new CombinedLogWriter(writersToRetain);
    }

    private _writers: LogWriter[];

    constructor(writers: LogWriter[]) {
        this._writers = writers.flatMap(writer => writer instanceof CombinedLogWriter ? writer._writers : writer);
    }

    get writers(): readonly LogWriter[] {
        return this._writers;
    }

    shouldLog(level: LogLevel, source?: string) {
        for (const writer of this._writers) {
            if (writer.shouldLog(level, source))
                return true;
        }
        return false;
    }

    log(message: LogMessage) {
        for (const writer of this._writers) {
            if (writer.shouldLog(message.level))
                writer.log(message);
        }
    }
}
