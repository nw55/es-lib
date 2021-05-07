import { LogMessage } from './common';

export type LogErrorFormatter = (error: Error, message: LogMessage) => string;

export type LogDetailsFormatter = (details: unknown, message: LogMessage) => string;
