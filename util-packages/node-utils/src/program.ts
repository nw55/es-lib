import { Awaitable } from '@nw55/common';
import { Log } from '@nw55/logging';

const logger = Log.createLogger('@nw55/node-utils/program');

function fail(message: string, reason: unknown): never {
    logger.logError('critical', reason, message);
    process.exit(1);
}

type MainFunction = (args: string[]) => Awaitable<void>;
type CleanupFunction = () => void;

interface RunOptions {
    main?: MainFunction | undefined;
    cleanup?: CleanupFunction | undefined;
    keepRunning?: boolean | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() { }

function exitOnSignal(signal: string) {
    logger.notice(`Received signal ${signal}, will exit.`);
    process.exit(0);
}

export async function runProgram(options: RunOptions): Promise<never> {
    const { main, cleanup, keepRunning } = options;

    logger.debug('Registering process event handlers...');

    process.on('exit', () => {
        logger.notice('Exiting...');
        if (cleanup !== undefined) {
            logger.verbose('Running cleanup function...');
            cleanup();
            logger.verbose('Cleanup function completed.');
        }
        else {
            logger.debug('Program without cleanup function.');
        }
    });

    for (const signal of ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGBREAK'])
        process.on(signal, () => exitOnSignal(signal));

    process.on('unhandledRejection', reason => fail('Unhandled promise rejection', reason));
    process.on('uncaughtException', reason => fail('Uncaught exception', reason));

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
    catch (e: unknown) {
        fail('Unhandled error in main function', e);
    }

    if (keepRunning === true) {
        logger.verbose('Keeping program running after completion of main function...');
        setInterval(noop, 1e9); // prevent node from exiting
        await new Promise(noop); // prevent this async function from returning
    }

    logger.verbose('Exiting after completion of main function...');

    process.exit(0);
}

export function runMain(main: MainFunction, cleanup?: CleanupFunction): Promise<never> {
    return runProgram({
        main,
        cleanup,
        keepRunning: false
    });
}

export function startMain(main: MainFunction, cleanup?: CleanupFunction): Promise<never> {
    return runProgram({
        main,
        cleanup,
        keepRunning: true
    });
}
