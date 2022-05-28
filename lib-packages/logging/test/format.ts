import { logFormat } from '@nw55/logging';

describe('format', () => {
    test('logFormat', () => {
        const format = logFormat`${'level'} [${'source'}] ${logFormat.text}`;
        const text = format({
            level: 'warn',
            source: ['@nw55', 'logging', 'format'],
            timestamp: new Date('2022-05-28T12:50:00+02:00'),
            message: {
                text: 'Test Text'
            }
        });
        expect(text).toBe('warn [@nw55/logging/format] Test Text');
    });
});
