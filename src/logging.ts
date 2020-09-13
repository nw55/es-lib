import { ConsoleLogMessageWriter, DefaultLogWriter, LogFilter, logFormat, LogFormat, LogMessageWriter, TransformedLogMessageWriter } from '@nw55/logging';

export namespace ConsoleLogWriter {
    type ColorStyler<K extends string> = {
        [P in K]: ColorStyler<K> & ((text: string) => string);
    };

    type DefaultColorStyler = ColorStyler<'gray' | 'cyanBright' | 'whiteBright' | 'greenBright' | 'yellowBright' | 'redBright' | 'red' | 'bgWhiteBright'>;

    function useColorStyler(baseWriter: LogMessageWriter, colorStyler?: DefaultColorStyler) {
        if (colorStyler === undefined)
            return baseWriter;

        return TransformedLogMessageWriter.byLevel(baseWriter, {
            all: text => colorStyler.gray(text),
            debug: text => colorStyler.whiteBright(text),
            info: text => colorStyler.cyanBright(text),
            notice: text => colorStyler.greenBright(text),
            warn: text => colorStyler.yellowBright(text),
            error: text => colorStyler.greenBright(text),
            critical: text => colorStyler.bgWhiteBright.red(text)
        });
    }

    // TODO
    export const defaultFormat = logFormat`${'datetime'} ${'level'}: ${'message'}`;

    interface Options {
        readonly filter?: LogFilter;
        readonly format?: LogFormat;
        readonly details?: 'none' | 'errors' | 'details' | 'all';
        readonly colorStyler?: DefaultColorStyler;
    }

    export function create(options: Options) {
        return new DefaultLogWriter({
            filter: options.filter,
            format: options.format ?? defaultFormat,
            messageWriter: useColorStyler(ConsoleLogMessageWriter.createDefault(console, options.details), options.colorStyler)
        });
    }
}
