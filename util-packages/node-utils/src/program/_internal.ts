import { Log } from '@nw55/logging';
import { CleanupOnExitHandler, ExitReason } from './exit';

export const logger = Log.createLogger('@nw55/node-utils/program');

let cleanupDone = false;
export const cleanupOnExitHandlers = new Set<CleanupOnExitHandler>();

export function handleExit() {
    logger.notice('Exiting...');

    cleanupOnExit('exit');
}

export function exitWithError(message: string, reason: unknown): never {
    logger.logError('critical', reason, message);
    cleanupOnExit('error');
    process.exit(1);
}

export function cleanupOnExit(reason: ExitReason) {
    if (cleanupDone) {
        logger.debug('Cleanup already done');
        return;
    }

    cleanupDone = true;

    if (cleanupOnExitHandlers.size === 0) {
        logger.debug('No cleanup handlers registered.');
        return;
    }

    logger.verbose('Running cleanup handlers...');
    for (const handler of cleanupOnExitHandlers) {
        try {
            handler(reason);
        }
        catch (e) {
            logger.logError('critical', e, 'Uncaught exception in cleanup handler.');
        }
    }
    logger.verbose('Cleanup handlers completed.');
}

export function exitWithSignal(signal: string) {
    logger.notice(`Received signal ${signal}, will exit.`);
    cleanupOnExit('signal');
    process.exit(0);
}
