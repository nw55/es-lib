import { PromiseSource } from '@nw55/common';
import { LogMessageWriter, WritableLogMessageWriter, WritableLogMessageWriterOptions } from '@nw55/logging';
import { createWriteStream } from 'fs';

export interface FileLogMessageWriterOptions extends WritableLogMessageWriterOptions {
    readonly file: string;
    readonly append?: boolean;
}

export async function openFileLogMessageWriter(options: FileLogMessageWriterOptions) {
    const append = options.append ?? true;
    const stream = createWriteStream(options.file, { flags: append ? 'a' : 'w' });
    const readyEvent = new PromiseSource();
    stream.once('ready', () => readyEvent.resolve());
    stream.once('error', e => readyEvent.reject(e));
    await readyEvent.promise;
    return new WritableLogMessageWriter(stream, options);
}

export function createStandardStreamsLogMessageWriter(options: WritableLogMessageWriterOptions): LogMessageWriter {
    const outWriter = new WritableLogMessageWriter(process.stdout, options);
    const errWriter = new WritableLogMessageWriter(process.stderr, options);
    return {
        writeMessage(text, messaeg) {
            if (messaeg.level.isError)
                errWriter.writeMessage(text, messaeg);
            else
                outWriter.writeMessage(text, messaeg);
        }
    };
}
