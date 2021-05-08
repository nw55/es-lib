import { testType, Type } from '@nw55/type-checking';
import { assert } from 'chai';

describe('array-types', () => {
    test('array', () => {
        const type = Type.array(String);
        assert.isTrue(testType(type, []));
        assert.isTrue(testType(type, ['str']));
        assert.isFalse(testType(type, [123]));
    });

    test('tuple', () => {
        const type = Type.from([String, Number] as const);
        assert.isTrue(testType(type, ['a', 1]));
        assert.isFalse(testType(type, ['a']));
        assert.isFalse(testType(type, ['a', 1, 2]));
    });
});
