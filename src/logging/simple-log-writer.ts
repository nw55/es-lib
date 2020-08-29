import { LogLevel, LogLevelKeys } from './log-level';
import { LogMessage, LogWriter } from './shared';

type MessageWriter = (message: string, details?: unknown) => void;

type SimpleLogWriterParams =
    | [writeAll: MessageWriter, logDetails?: boolean]
    | [writerInfo: MessageWriter, writeError: MessageWriter, logDetails?: boolean]
    | [level: LogLevel<LogLevelKeys.Info>, writeAll: MessageWriter, logDetails?: boolean]
    | [level: LogLevel<LogLevelKeys.Info>, writerInfo: MessageWriter, writeError: MessageWriter, logDetails?: boolean]
    | [level: LogLevel<LogLevelKeys.Error>, writeError: MessageWriter, logDetails?: boolean];

interface SimpleLogWriterOptions {
    level: LogLevel;
    logDetails: boolean;
    writeInfo: MessageWriter;
    writeError: MessageWriter;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function -- this is intentionally a no-op
const noopMessageWriter: MessageWriter = () => { };

function optionsFromParams(params: SimpleLogWriterParams): SimpleLogWriterOptions {
    let level;
    let logDetails;
    let writeInfo;
    let writeError;

    if (typeof params[0] === 'function') {
        level = LogLevel.All;
        writeInfo = params[0];
        if (typeof params[1] === 'function') {
            writeError = params[1];
            logDetails = (params[2] ?? false) as boolean;
        }
        else {
            writeError = params[0];
            logDetails = params[1] ?? false;
        }
    }
    else {
        level = params[0];
        if (level.isError) {
            writeInfo = noopMessageWriter;
            writeError = params[1] as MessageWriter;
            logDetails = (params[2] ?? false) as boolean;
        }
        else {
            writeInfo = params[1] as MessageWriter;
            if (typeof params[2] === 'function') {
                writeError = params[2];
                logDetails = params[3] ?? false;
            }
            else {
                writeError = params[1] as MessageWriter;
                logDetails = params[2] ?? false;
            }
        }
    }

    return { level, logDetails, writeInfo, writeError };
}

export class SimpleLogWriter implements LogWriter {
    private _options: SimpleLogWriterOptions;

    constructor(...params: SimpleLogWriterParams) {
        this._options = optionsFromParams(params);
    }

    get level() {
        return this._options.level;
    }

    shouldLog(level: LogLevel) {
        return level.code >= this._options.level.code;
    }

    log(message: LogMessage) {
        if (!this.shouldLog(message.level))
            return;

        let str = message.level.symbol + ' ';
        if (message.source !== undefined)
            str += `[${message.source}] `;
        if (message.code !== undefined)
            str += `${message.code}: `;
        str += message.message;

        const writer = message.level.isError ? this._options.writeError : this._options.writeInfo;

        if (this._options.logDetails && message.details !== undefined)
            writer(str, message.details);
        else
            writer(str);
    }
}
