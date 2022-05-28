import { LogLevel, LogSource } from '@nw55/common';
import { CombinedLogWriter, LogEntry, LogWriter } from '@nw55/logging';

class TestLogWriter implements LogWriter {
    didLog = false;

    constructor(private _id: string, private _shouldLog: boolean) { }

    shouldLog(level: LogLevel, source: LogSource) {
        return this._shouldLog;
    }

    log(entry: LogEntry) {
        this.didLog = true;
    }
}

const testLogEntry: LogEntry = {
    level: 'info',
    source: null,
    timestamp: new Date('2022-05-28T12:50:00+02:00'),
    message: {}
};

describe('combined-log-writer', () => {
    test('shouldLog / log', () => {
        const writer1 = new TestLogWriter('1', true);
        const writer2 = new TestLogWriter('2', false);
        const writer3 = new TestLogWriter('3', false);

        const combined1 = new CombinedLogWriter([writer1, writer2]);
        expect(combined1.shouldLog('info', null)).toBeTrue(); // shouldLog() should return true
        combined1.log(testLogEntry);
        expect(writer1.didLog).toBeTrue(); // should call log()

        const combined2 = new CombinedLogWriter([writer2, writer3]);
        expect(combined2.shouldLog('info', null)).toBeFalse();
    });

    test('flattening of nested combined log writers', () => {
        const writer1 = new TestLogWriter('1', true);
        const writer2 = new TestLogWriter('2', false);
        const writer3 = new TestLogWriter('3', false);

        const combined1 = new CombinedLogWriter([writer1, writer2]);
        const combined2 = new CombinedLogWriter([combined1, writer3]);

        expect(combined2.writers).toStrictEqual([writer1, writer2, writer3]); // should flatten and maintain order
    });

    test('static addLogWriter / removeLogWriter', () => {
        const writer1 = new TestLogWriter('1', true);
        const writer2 = new TestLogWriter('2', false);
        const writer3 = new TestLogWriter('3', false);

        const add0 = CombinedLogWriter.addLogWriter(null, writer1);
        expect(add0).toBe(writer1); // adding to null should return added writer

        const add1 = CombinedLogWriter.addLogWriter(writer1, writer2);
        expect(add1).toBeInstanceOf(CombinedLogWriter); // should create combined writer
        expect((add1 as CombinedLogWriter).writers).toStrictEqual([writer1, writer2]); // should combine

        const add2 = CombinedLogWriter.addLogWriter(writer3, add1);
        expect(add2).toBeInstanceOf(CombinedLogWriter); // should create combined writer
        expect((add2 as CombinedLogWriter).writers).toStrictEqual([writer3, writer1, writer2]); // should add combined writer

        const add3 = CombinedLogWriter.addLogWriter(add1, add2);
        expect(add3).toBeInstanceOf(CombinedLogWriter); // should create combined writer
        expect((add3 as CombinedLogWriter).writers).toStrictEqual([writer1, writer2, writer3, writer1, writer2]); // should combine combined writers

        const remove0 = CombinedLogWriter.removeLogWriter(null, writer1);
        expect(remove0).toBeNull(); // remove from null should return null

        const remove1 = CombinedLogWriter.removeLogWriter(add3, writer1);
        expect(remove1).toBeInstanceOf(CombinedLogWriter); // should create combined writer
        expect((remove1 as CombinedLogWriter).writers).toStrictEqual([writer2, writer3, writer1, writer2]); // should remove only first instance of single from combined

        const remove2 = CombinedLogWriter.removeLogWriter(add3, add1);
        expect(remove2).toBeInstanceOf(CombinedLogWriter); // should create combined writer
        expect((remove2 as CombinedLogWriter).writers).toStrictEqual([writer3, writer1, writer2]); // should remove combined from combined

        const remove3 = CombinedLogWriter.removeLogWriter(add3, add3);
        expect(remove3).toBeNull(); // remove from itself should return null

        const add3b = new CombinedLogWriter((add3 as CombinedLogWriter).writers);
        const remove4 = CombinedLogWriter.removeLogWriter(add3, add3b);
        expect(remove4).toBeNull(); // remove should work with duplicates and return null instead of empty combined

        const remove5 = CombinedLogWriter.removeLogWriter(writer1, add1);
        expect(remove5).toBeNull(); // remove combined from single should work
    });
});
