import { LogLevelKeys } from '@nw55/common';
import { LogMessage } from './common';

export interface LogMessageWriter {
    writeMessage(text: string, message: LogMessage): void;
}

function inheritLogLevelProperties<D, T = D>(properties: Partial<Record<LogLevelKeys, T>>, defaultValue: D): Record<LogLevelKeys, T | D> {
    const all = properties.all ?? defaultValue;
    const trace = properties.trace ?? all;
    const verbose = properties.verbose ?? trace;
    const debug = properties.debug ?? verbose;
    const info = properties.info ?? debug;
    const notice = properties.notice ?? info;
    const warn = properties.warn ?? notice;
    const error = properties.error ?? warn;
    const critical = properties.critical ?? error;
    const fatal = properties.fatal ?? critical;
    return { all, trace, verbose, debug, info, notice, warn, error, critical, fatal };
}

type LogMessageTransformation = (text: string, message: LogMessage) => string;

export class TransformedLogMessageWriter implements LogMessageWriter {
    static byLevel(baseWriter: LogMessageWriter, transformations: Partial<Record<LogLevelKeys, LogMessageTransformation>>) {
        const inheritedTransformations = inheritLogLevelProperties(transformations, null);
        const transformation: LogMessageTransformation = (text, message) => {
            const transformer = inheritedTransformations[message.level.key];
            return transformer === null ? text : transformer(text, message);
        };
        return new TransformedLogMessageWriter(baseWriter, transformation);
    }

    private _baseWriter: LogMessageWriter;
    private _transformation: LogMessageTransformation;

    constructor(baseWriter: LogMessageWriter, transformation: LogMessageTransformation) {
        this._baseWriter = baseWriter;
        this._transformation = transformation;
    }

    writeMessage(text: string, message: LogMessage) {
        const transformedText = this._transformation(text, message);
        this._baseWriter.writeMessage(transformedText, message);
    }
}
