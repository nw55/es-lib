import { LogLevel } from './log-level';

export interface LogMessage {
    level: LogLevel;
    source?: string;
    code?: string;
    error?: Error;
    message: string;
    details?: unknown;
}

export interface LogWriter {
    shouldLog(level: LogLevel): boolean;

    log(message: LogMessage): void;
}

export class CombinedLogWriter implements LogWriter {
    private _writers: LogWriter[];

    constructor(...writers: LogWriter[]) {
        this._writers = writers.flatMap(writer => writer instanceof CombinedLogWriter ? writer._writers : writer);
    }

    get writers(): readonly LogWriter[] {
        return this._writers;
    }

    shouldLog(level: LogLevel) {
        for (const writer of this._writers) {
            if (writer.shouldLog(level))
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
