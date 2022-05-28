import { LogLevel, LogSource } from '@nw55/common';
import { LogEntry, LogWriter } from './common';

export class CombinedLogWriter implements LogWriter {
    static addLogWriter(logWriter: LogWriter | null, add: LogWriter) {
        if (logWriter === null)
            return add;
        return new CombinedLogWriter([logWriter, add]);
    }

    static removeLogWriter(logWriter: LogWriter | null, remove: LogWriter) {
        if (logWriter === remove || logWriter === null)
            return null;

        if (!(logWriter instanceof CombinedLogWriter)) {
            if (remove instanceof CombinedLogWriter) {
                if (remove.writers.includes(logWriter))
                    return null;
            }

            return logWriter;
        }

        if (remove instanceof CombinedLogWriter) {
            const writersToRemove = new Map<LogWriter, number>();
            for (const writer of remove.writers)
                writersToRemove.set(writer, (writersToRemove.get(writer) ?? 0) + 1);
            const writersToRetain = [];
            for (const writer of logWriter.writers) {
                const removeCount = writersToRemove.get(writer);
                if (removeCount !== undefined && removeCount > 0)
                    writersToRemove.set(writer, removeCount - 1);
                else
                    writersToRetain.push(writer);
            }
            if (writersToRetain.length === 0)
                return null;
            return new CombinedLogWriter(writersToRetain);
        }

        const writersToRetain = [];
        let removed = false;
        for (const writer of logWriter.writers) {
            if (!removed && writer === remove)
                removed = true;
            else
                writersToRetain.push(writer);
        }
        if (writersToRetain.length === 0)
            return null;
        return new CombinedLogWriter(writersToRetain);
    }

    private _writers: LogWriter[];

    constructor(writers: readonly LogWriter[]) {
        this._writers = writers.flatMap(writer => writer instanceof CombinedLogWriter ? writer._writers : writer);
    }

    get writers(): readonly LogWriter[] {
        return this._writers;
    }

    shouldLog(level: LogLevel, source: LogSource) {
        for (const writer of this._writers) {
            if (writer.shouldLog(level, source))
                return true;
        }
        return false;
    }

    log(entry: LogEntry) {
        for (const writer of this._writers)
            writer.log(entry);
    }
}
