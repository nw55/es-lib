import { LogEntry } from './common';
import { getInheritedLogLevelProperties, PartialLogLevelProperties } from './log-level-metadata';

export interface LogTextWriter {
    writeEntry(text: string, entry: LogEntry): void;
}

type LogTextTransformation = (text: string, entry: LogEntry) => string;

const doNothingTransformation: LogTextTransformation = text => text;

export class TransformedLogTextWriter implements LogTextWriter {
    static byLevel(baseWriter: LogTextWriter, transformations: PartialLogLevelProperties<LogTextTransformation>) {
        const inheritedTransformations = getInheritedLogLevelProperties(transformations, doNothingTransformation);
        const transformation: LogTextTransformation = (text, entry) => {
            const transformer = inheritedTransformations[entry.level];
            return transformer(text, entry);
        };
        return new TransformedLogTextWriter(baseWriter, transformation);
    }

    private _baseWriter: LogTextWriter;
    private _transformation: LogTextTransformation;

    constructor(baseWriter: LogTextWriter, transformation: LogTextTransformation) {
        this._baseWriter = baseWriter;
        this._transformation = transformation;
    }

    writeEntry(text: string, entry: LogEntry) {
        const transformedText = this._transformation(text, entry);
        this._baseWriter.writeEntry(transformedText, entry);
    }
}
