import { LogLevel, SourcePrefixLogFilter } from '@nw55/logging';

describe('filter', () => {
    test('SourcePrefixLogFilter', () => {
        const filter = new SourcePrefixLogFilter('info', {
            '@nw55': 'warn',
            'app': 'verbose',
            'app/test1': 'critical'
        });

        expect(filter.shouldLog(LogLevel.All)).toBeFalse(); // no source All should not log
        expect(filter.shouldLog(LogLevel.Information)).toBeTrue(); // no source Information should log
        expect(filter.shouldLog(LogLevel.Error)).toBeTrue(); // no source Error should log

        expect(filter.shouldLog(LogLevel.All, '@nw55')).toBeFalse(); // @nw55 All should not log
        expect(filter.shouldLog(LogLevel.Information, '@nw55')).toBeFalse(); // @nw55 Information should not log
        expect(filter.shouldLog(LogLevel.Error, '@nw55')).toBeTrue(); // @nw55 Error should log

        expect(filter.shouldLog(LogLevel.All, 'app')).toBeFalse(); // app All should not log
        expect(filter.shouldLog(LogLevel.Information, 'app')).toBeTrue(); // app Information should log
        expect(filter.shouldLog(LogLevel.Error, 'app')).toBeTrue(); // app Error should log

        expect(filter.shouldLog(LogLevel.All, 'app/test1')).toBeFalse(); // app/test1 All should not log
        expect(filter.shouldLog(LogLevel.Information, 'app/test1')).toBeFalse(); // app/test1 Information should not log
        expect(filter.shouldLog(LogLevel.Error, 'app/test1')).toBeFalse(); // app/test1 Error should not log

        expect(filter.shouldLog(LogLevel.All, 'app/test2')).toBeFalse(); // app/test2 All should not log
        expect(filter.shouldLog(LogLevel.Information, 'app/test2')).toBeTrue(); // app/test2 Information should log
        expect(filter.shouldLog(LogLevel.Error, 'app/test2')).toBeTrue(); // app/test2 Error should log
    });
});
