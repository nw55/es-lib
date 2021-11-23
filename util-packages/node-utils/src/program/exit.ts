import { cleanupOnExitHandlers, exitWithError, exitWithSignal, handleExit, logger } from './_internal';

export type ExitReason = 'signal' | 'error' | 'exit';
export type CleanupOnExitHandler = (reason: ExitReason) => void;
const allExitSignals = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGBREAK'];

let exitHandlerSetUp = false;

export function addCleanupOnExitHandler(handler: CleanupOnExitHandler) {
    setupExitHandlers();
    cleanupOnExitHandlers.add(handler);
}

export function removeCleanupOnExitHandler(handler: CleanupOnExitHandler) {
    cleanupOnExitHandlers.delete(handler);
}

export function setupExitHandlers() {
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
