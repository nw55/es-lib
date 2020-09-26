import { testType, Type } from '@nw55/type-checking';
import { assert } from 'chai';
import { describe, test } from 'mocha';

describe('object-types', () => {
    test('plain object', () => {
        const type = Type.plainObject({}, {
            a: String
        });
        assert.isTrue(testType(type, { a: 'string' }));
        assert.isTrue(testType(type, { a: 'string', b: 123 }));
        assert.isFalse(testType(type, {}));
        assert.isFalse(testType(type, { a: 123 }));
    });

    test('plain object: partial', () => {
        const type = Type.plainObject({ partial: true }, {
            a: String
        });
        assert.isTrue(testType(type, { a: 'string' }));
        assert.isTrue(testType(type, {}));
        assert.isFalse(testType(type, { a: 123 }));
    });

    test('plain object: no excess properties', () => {
        const type = Type.plainObject({ noExcessProperties: true }, {
            a: String
        });
        assert.isTrue(testType(type, { a: 'string' }));
        assert.isFalse(testType(type, {}));
        assert.isFalse(testType(type, { a: 'string', b: 'string' }));
    });

    test('plain object with optional', () => {
        const type = Type.from({
            a: String,
            b: Type.optional(String)
        });
        assert.isTrue(testType(type, { a: 'string', b: 'string' }));
        assert.isTrue(testType(type, { a: 'string', b: undefined }));
        assert.isTrue(testType(type, { a: 'string' }));
        assert.isFalse(testType(type, { b: 'string' }));
        assert.isFalse(testType(type, {}));
    });

    test('record', () => {
        const type = Type.record(Number);
        assert.isTrue(testType(type, { a: 1, b: 2 }));
        assert.isTrue(testType(type, { a: 1 }));
        assert.isTrue(testType(type, {}));
        assert.isFalse(testType(type, { a: 1, b: 'string' }));
        assert.isFalse(testType(type, { a: 'string' }));
    });

    test('record with union key', () => {
        const type = Type.record(Type.union('a', 'b'), Number);
        assert.isTrue(testType(type, { a: 1, b: 2 }));
        assert.isFalse(testType(type, { a: 1, c: 2 }));
        assert.isTrue(testType(type, {}));
        assert.isFalse(testType(type, { a: 1, b: 'string' }));
        assert.isFalse(testType(type, { a: 'string' }));
    });
});
