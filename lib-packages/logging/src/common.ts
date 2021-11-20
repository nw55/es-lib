import { LogDetails } from '@nw55/common';
import { LogLevel } from './log-level';

export interface LogMessage extends LogDetails {
    readonly level: LogLevel;
    readonly source?: string | undefined;
    readonly message: string;
}

export interface LogWriter {
    shouldLog: (level: LogLevel, source?: string) => boolean;

    log: (message: LogMessage) => void;
}
