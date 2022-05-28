import { PromiseSource } from '@nw55/common';
import { logLevelMetadata, LogTextWriter, WritableLogMessageWriterOptions, WritableLogTextWriter } from '@nw55/logging';
import { createWriteStream } from 'fs';

export interface FileLogTextWriterOptions extends WritableLogMessageWriterOptions {
    readonly file: string;
    readonly append?: boolean | undefined;
}

export async function openFileLogTextWriter(options: FileLogTextWriterOptions) {
    const append = options.append ?? true;
    const stream = createWriteStream(options.file, { flags: append ? 'a' : 'w' });
    const readyEvent = new PromiseSource();
    stream.once('ready', () => readyEvent.resolve());
    stream.once('error', e => readyEvent.reject(e));
    await readyEvent.promise;
    return new WritableLogTextWriter(stream, options);
}

export function createStandardStreamsLogTextWriter(options: WritableLogMessageWriterOptions): LogTextWriter {
    const outWriter = new WritableLogTextWriter(process.stdout, options);
    const errWriter = new WritableLogTextWriter(process.stderr, options);
    return {
        writeEntry: (text, entry) => {
            if (logLevelMetadata[entry.level].isError)
                errWriter.writeEntry(text, entry);
            else
                outWriter.writeEntry(text, entry);
        }
    };
}
