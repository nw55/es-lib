import { Awaitable, InvalidOperationError, PromiseSource } from '@nw55/common';
import { setupExitHandlers } from './exit';
import { exitWithError, logger } from './_internal';

type MainFunction = (args: string[]) => Awaitable<void>;

let programRunning = false;
let programStopEvent: PromiseSource | null = null;
let programIntervalHandle: NodeJS.Timer | null = null;

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() { }

async function runMainFunction(main?: MainFunction) {
    const args = process.argv.slice(2);

    if (logger.shouldLog('trace'))
        logger.trace(`${args.length} command line argument${args.length === 1 ? '' : 's'}`, { args });

    try {
        if (main !== undefined) {
            logger.verbose('Executing main function...');
            await main(args);
        }
        else {
            logger.debug('Program without main function.');
        }
    }
    catch (e) {
        exitWithError('Unhandled error in main function', e);
    }
}

export async function runMain(main: MainFunction) {
    setupExitHandlers();

    const args = process.argv.slice(2);

    if (logger.shouldLog('trace'))
        logger.trace(`${args.length} command line argument${args.length === 1 ? '' : 's'}`, { args });

    await runMainFunction(main);

    logger.verbose('Exiting after completion of main function...');

    process.exit(0);
}

export async function startProgram(main?: MainFunction): Promise<void> {
    if (!programRunning)
        throw new InvalidOperationError('Program already running');
    programRunning = true;

    setupExitHandlers();

    const args = process.argv.slice(2);

    if (logger.shouldLog('trace'))
        logger.trace(`${args.length} command line argument${args.length === 1 ? '' : 's'}`, { args });

    await runMainFunction(main);

    logger.verbose('Keeping program running after completion of main function...');
    programIntervalHandle = setInterval(noop, 1e9); // prevent node from exiting
    programStopEvent = new PromiseSource();
    await programStopEvent.promise; // prevent this async function from returning

    process.exit(0);
}

export function stopProgram() {
    if (!programRunning)
        throw new InvalidOperationError('Program not running');
    logger.verbose('Stopping program...');
    programStopEvent!.resolve();
    clearInterval(programIntervalHandle!);
}
