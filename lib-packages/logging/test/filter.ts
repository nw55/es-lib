import { SourcePrefixLogFilter } from '@nw55/logging';

describe('filter', () => {
    test('SourcePrefixLogFilter', () => {
        const filter = SourcePrefixLogFilter.fromStringMap('info', {
            '@nw55': 'warn',
            'app': 'verbose',
            'app/test1': 'critical'
        });

        expect(filter.shouldLog('trace', null)).toBeFalse(); // no source trace should not log
        expect(filter.shouldLog('info', null)).toBeTrue(); // no source info should log
        expect(filter.shouldLog('error', null)).toBeTrue(); // no source error should log

        expect(filter.shouldLog('trace', '@nw55')).toBeFalse(); // @nw55 trace should not log
        expect(filter.shouldLog('info', '@nw55')).toBeFalse(); // @nw55 info should not log
        expect(filter.shouldLog('error', '@nw55')).toBeTrue(); // @nw55 error should log

        expect(filter.shouldLog('trace', 'app')).toBeFalse(); // app trace should not log
        expect(filter.shouldLog('info', 'app')).toBeTrue(); // app info should log
        expect(filter.shouldLog('error', 'app')).toBeTrue(); // app error should log

        expect(filter.shouldLog('trace', ['app', 'test1'])).toBeFalse(); // app/test1 trace should not log
        expect(filter.shouldLog('info', ['app', 'test1'])).toBeFalse(); // app/test1 info should not log
        expect(filter.shouldLog('error', ['app', 'test1'])).toBeFalse(); // app/test1 error should not log

        expect(filter.shouldLog('trace', ['app', 'test2'])).toBeFalse(); // app/test2 trace should not log
        expect(filter.shouldLog('info', ['app', 'test2'])).toBeTrue(); // app/test2 info should log
        expect(filter.shouldLog('error', ['app', 'test2'])).toBeTrue(); // app/test2 error should log
    });
});
