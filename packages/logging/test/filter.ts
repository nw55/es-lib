import { LogLevel, SourcePrefixLogFilter } from '@nw55/logging';
import { assert } from 'chai';

describe('filter', () => {
    test('SourcePrefixLogFilter', () => {
        const filter = new SourcePrefixLogFilter('info', {
            '@nw55': 'warn',
            'app': 'verbose',
            'app/test1': 'critical'
        });

        assert.isFalse(filter.shouldLog(LogLevel.All), 'no source All should not log');
        assert.isTrue(filter.shouldLog(LogLevel.Information), 'no source Information should log');
        assert.isTrue(filter.shouldLog(LogLevel.Error), 'no source Error should log');

        assert.isFalse(filter.shouldLog(LogLevel.All, '@nw55'), '@nw55 All should not log');
        assert.isFalse(filter.shouldLog(LogLevel.Information, '@nw55'), '@nw55 Information should not log');
        assert.isTrue(filter.shouldLog(LogLevel.Error, '@nw55'), '@nw55 Error should log');

        assert.isFalse(filter.shouldLog(LogLevel.All, 'app'), 'app All should not log');
        assert.isTrue(filter.shouldLog(LogLevel.Information, 'app'), 'app Information should log');
        assert.isTrue(filter.shouldLog(LogLevel.Error, 'app'), 'app Error should log');

        assert.isFalse(filter.shouldLog(LogLevel.All, 'app/test1'), 'app/test1 All should not log');
        assert.isFalse(filter.shouldLog(LogLevel.Information, 'app/test1'), 'app/test1 Information should not log');
        assert.isFalse(filter.shouldLog(LogLevel.Error, 'app/test1'), 'app/test1 Error should not log');

        assert.isFalse(filter.shouldLog(LogLevel.All, 'app/test2'), 'app/test2 All should not log');
        assert.isTrue(filter.shouldLog(LogLevel.Information, 'app/test2'), 'app/test2 Information should log');
        assert.isTrue(filter.shouldLog(LogLevel.Error, 'app/test2'), 'app/test2 Error should log');
    });
});
