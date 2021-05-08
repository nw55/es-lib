import { logFormat, LogLevel } from '@nw55/logging';

describe('format', () => {
    test('logFormat', () => {
        const format = logFormat`${'level'} [${'source'}] ${logFormat.message}`;
        const text = format({
            level: LogLevel.Warning,
            source: '@nw55/logging/format',
            message: 'Test Message'
        });
        expect(text).toBe('warn [@nw55/logging/format] Test Message');
    });
});
