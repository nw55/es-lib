import { testType, Type } from '@nw55/type-checking';
import { assert } from 'chai';
import { describe, test } from 'mocha';

describe('special-types', () => {
    test('union', () => {
        const type = Type.union(String, Number);
        assert.isTrue(testType(type, 'string'));
        assert.isTrue(testType(type, 123));
        assert.isFalse(testType(type, true));
    });

    test('nested union', () => {
        const type = Type.union(String, Type.union(Number, Boolean));
        assert.isTrue(testType(type, 'string'));
        assert.isTrue(testType(type, 123));
        assert.isTrue(testType(type, true));
        assert.isFalse(testType(type, []));
    });

    test('optional', () => {
        const type = Type.optional(String);
        assert.isTrue(testType(type, undefined));
        assert.isTrue(testType(type, 'string'));
        assert.isFalse(testType(type, null));
        assert.isFalse(testType(type, 1));
    });
});
