import { ArgumentError, type Awaitable, InvalidOperationError, PromiseSource } from '@nw55/common';
import { setupExitHandlers, waitForSigint } from './exit.js';
import { exitWithError, logger } from './_internal.js';

type MainFunction = (args: string[], stopEvent: Promise<void>) => Awaitable<void>;

let stopEventSource: PromiseSource | null = null;

async function runMainFunction(main: MainFunction, stopEvent: Promise<void>) {
    const args = process.argv.slice(2);

    if (logger.shouldLog('trace'))
        logger.trace(`${args.length} command line argument${args.length === 1 ? '' : 's'}`, { args });

    try {
        logger.debug('Executing main function...');
        await main(args, stopEvent);
    }
    catch (e) {
        exitWithError('Unhandled error in main function', e);
    }
}

export interface ProgramOptions {
    sigint?: 'exit' | 'stop' | 'ignore';
}

export async function startProgram(main: MainFunction): Promise<void>;
export async function startProgram(options: ProgramOptions, main: MainFunction): Promise<void>;
export async function startProgram(mainOrOptions: MainFunction | ProgramOptions, mainOrNothing?: MainFunction) {
    if (stopEventSource !== null)
        throw new InvalidOperationError('Program already running');
    stopEventSource = new PromiseSource();

    const main = typeof mainOrOptions === 'function' ? mainOrOptions : mainOrNothing;
    const options = typeof mainOrOptions !== 'function' ? mainOrOptions : {};
    if (typeof main !== 'function')
        throw new ArgumentError();

    const handleSigint = options.sigint ?? 'exit';

    setupExitHandlers({
        sigint: handleSigint === 'stop' ? 'event' : handleSigint
    });

    const stopEvents = [stopEventSource.promise];
    if (handleSigint === 'stop')
        stopEvents.push(waitForSigint());
    const stopEvent = Promise.race(stopEvents);

    await runMainFunction(main, stopEvent);

    logger.debug('Exiting after completion of main function...');

    process.exit(0);
}

export function stopProgram() {
    if (stopEventSource === null)
        throw new InvalidOperationError('Program not running');
    logger.verbose('Stopping program...');
    stopEventSource.resolve();
}
