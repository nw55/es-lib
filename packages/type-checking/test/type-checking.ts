import { requireType, testType, Type } from '@nw55/type-checking';
import { assert } from 'chai';

describe('type-checking', () => {
    test('unchecked', () => {
        const type = Type.unchecked<unknown>();
        assert.isTrue(testType(type, 1));
        assert.isTrue(testType(type, ''));
        assert.isTrue(testType(type, {}));
    });

    test('complex type', () => {
        const type = Type.from({
            a: String,
            b: Type.array(Number)
        });
        const matchingValue = {
            a: 'string',
            b: [1, 2]
        };
        const failingValue = {
            a: 'a',
            b: ['b']
        };
        assert.isTrue(testType(type, matchingValue));
        assert.isFalse(testType(type, failingValue));
        requireType(type, matchingValue);
        assert.throws(() => requireType(type, failingValue));
    });
});
