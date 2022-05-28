import { LogLevel, LogMessage, LogSource } from '@nw55/common';

export interface LogEntry {
    readonly level: LogLevel;
    readonly source: LogSource;
    readonly timestamp: Date;
    readonly message: LogMessage;
}

export interface LogWriter {
    shouldLog(level: LogLevel, source: LogSource): boolean;

    log(entry: LogEntry): void;
}
