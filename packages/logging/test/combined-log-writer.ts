import { LogLevelKeys } from '@nw55/common';
import { CombinedLogWriter, LogLevel, LogMessage, LogWriter } from '@nw55/logging';
import { assert } from 'chai';
import { describe, test } from 'mocha';

class TestLogWriter implements LogWriter {
    didLog = false;

    constructor(private _id: string, private _shouldLog: boolean) {
    }

    shouldLog(level: LogLevel<LogLevelKeys>, source?: string) {
        return this._shouldLog;
    }

    log(message: LogMessage) {
        this.didLog = true;
    }
}

const testLogMessage: LogMessage = {
    level: LogLevel.Information,
    message: ''
};

describe('combined-log-writer', () => {
    test('shouldLog / log', () => {
        const writer1 = new TestLogWriter('1', true);
        const writer2 = new TestLogWriter('2', false);
        const writer3 = new TestLogWriter('3', false);

        const combined1 = new CombinedLogWriter([writer1, writer2]);
        assert.isTrue(combined1.shouldLog(LogLevel.Information), 'shouldLog() should return true');
        combined1.log(testLogMessage);
        assert.isTrue(writer1.didLog, 'should call log()');
        assert.isFalse(writer2.didLog, 'should not call log()');

        const combined2 = new CombinedLogWriter([writer2, writer3]);
        assert.isFalse(combined2.shouldLog(LogLevel.Information));
        combined2.log(testLogMessage);
        assert.isFalse(writer2.didLog, 'should not call log()');
        assert.isFalse(writer3.didLog, 'should not call log()');
    });

    test('flattening of nested combined log writers', () => {
        const writer1 = new TestLogWriter('1', true);
        const writer2 = new TestLogWriter('2', false);
        const writer3 = new TestLogWriter('3', false);

        const combined1 = new CombinedLogWriter([writer1, writer2]);
        const combined2 = new CombinedLogWriter([combined1, writer3]);

        assert.deepStrictEqual(combined2.writers, [writer1, writer2, writer3], 'should flatten and maintain order');
    });

    test('static addLogWriter / removeLogWriter', () => {
        const writer1 = new TestLogWriter('1', true);
        const writer2 = new TestLogWriter('2', false);
        const writer3 = new TestLogWriter('3', false);

        const add0 = CombinedLogWriter.addLogWriter(null, writer1);
        assert.strictEqual(add0, writer1, 'adding to null should return added writer');

        const add1 = CombinedLogWriter.addLogWriter(writer1, writer2);
        assert.instanceOf(add1, CombinedLogWriter, 'should create combined writer');
        assert.deepStrictEqual((add1 as CombinedLogWriter).writers, [writer1, writer2], 'should combine');

        const add2 = CombinedLogWriter.addLogWriter(writer3, add1);
        assert.instanceOf(add2, CombinedLogWriter, 'should create combined writer');
        assert.deepStrictEqual((add2 as CombinedLogWriter).writers, [writer3, writer1, writer2], 'should add combined writer');

        const add3 = CombinedLogWriter.addLogWriter(add1, add2);
        assert.instanceOf(add3, CombinedLogWriter, 'should create combined writer');
        assert.deepStrictEqual((add3 as CombinedLogWriter).writers, [writer1, writer2, writer3, writer1, writer2], 'should combine combined writers');

        const remove0 = CombinedLogWriter.removeLogWriter(null, writer1);
        assert.isNull(remove0, 'remove from null should return null');

        const remove1 = CombinedLogWriter.removeLogWriter(add3, writer1);
        assert.instanceOf(remove1, CombinedLogWriter, 'should create combined writer');
        assert.deepStrictEqual((remove1 as CombinedLogWriter).writers, [writer2, writer3, writer1, writer2], 'should remove only first instance of single from combined');

        const remove2 = CombinedLogWriter.removeLogWriter(add3, add1);
        assert.instanceOf(remove2, CombinedLogWriter, 'should create combined writer');
        assert.deepStrictEqual((remove2 as CombinedLogWriter).writers, [writer3, writer1, writer2], 'should remove combined from combined');

        const remove3 = CombinedLogWriter.removeLogWriter(add3, add3);
        assert.isNull(remove3, 'remove from itself should return null');

        const add3b = new CombinedLogWriter((add3 as CombinedLogWriter).writers);
        const remove4 = CombinedLogWriter.removeLogWriter(add3, add3b);
        assert.isNull(remove4, 'remove should work with duplicates and return null instead of empty combined');

        const remove5 = CombinedLogWriter.removeLogWriter(writer1, add1);
        assert.isNull(remove5, 'remove combined from single should work');
    });
});
