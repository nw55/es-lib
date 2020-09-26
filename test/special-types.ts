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

    test('intersection', () => {
        const type = Type.intersection({ a: String }, { b: Number });
        assert.isTrue(testType(type, { a: 'string', b: 123 }));
        assert.isFalse(testType(type, { a: 'string' }));
        assert.isFalse(testType(type, { b: 123 }));
    });

    test('nested intersection', () => {
        const type = Type.intersection({ a: String }, Type.intersection({ b: Number }, { c: Boolean }));
        assert.isTrue(testType(type, { a: 'string', b: 123, c: true }));
        assert.isFalse(testType(type, { a: 'string', c: true }));
    });

    test('optional', () => {
        const type = Type.optional(String);
        assert.isTrue(testType(type, undefined));
        assert.isTrue(testType(type, 'string'));
        assert.isFalse(testType(type, null));
        assert.isFalse(testType(type, 1));
    });
});
