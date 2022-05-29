import { PromiseSource } from '@nw55/common';
import { cleanupOnExit, cleanupOnExitHandlers, exitWithError, handleExit, logger } from './_internal';

export type ExitReason = 'signal' | 'error' | 'exit';
export type CleanupOnExitHandler = (reason: ExitReason) => void;
const allExitSignals = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGBREAK'];

const sigintEvent = new PromiseSource();

let exitHandlerSetUp = false;
let sigint: NonNullable<ExitHandlerOptions['sigint']> = 'exit';

export function addCleanupOnExitHandler(handler: CleanupOnExitHandler) {
    setupExitHandlers();
    cleanupOnExitHandlers.add(handler);
}

export function removeCleanupOnExitHandler(handler: CleanupOnExitHandler) {
    cleanupOnExitHandlers.delete(handler);
}

export interface ExitHandlerOptions {
    readonly sigint?: 'exit' | 'event' | 'ignore';
}

export function setupExitHandlers(options: ExitHandlerOptions = {}) {
    if (options.sigint !== undefined)
        sigint = options.sigint;

    if (exitHandlerSetUp)
        return;

    exitHandlerSetUp = true;

    logger.debug('Setting up exit handlers...');

    process.on('exit', handleExit);
    process.on('unhandledRejection', reason => exitWithError('Unhandled promise rejection', reason));
    process.on('uncaughtException', reason => exitWithError('Uncaught exception', reason));

    for (const signal of allExitSignals)
        process.on(signal, () => exitWithSignal(signal));
}

function exitWithSignal(signal: string) {
    if (signal === 'SIGINT') {
        if (sigint === 'ignore') {
            logger.debug(`Received ignored signal ${signal}.`);
            return;
        }
        else if (sigint === 'event') {
            logger.debug(`Received signal ${signal}, will stop.`);
            sigintEvent.resolve();
            return;
        }
    }
    logger.debugAlert(`Received signal ${signal}, will exit.`);
    cleanupOnExit('signal');
    process.exit(0);
}

export function waitForSigint() {
    setupExitHandlers({ sigint: 'event' });
    return sigintEvent.promise;
}
