import { testType, Type } from '@nw55/type-checking';
import { assert } from 'chai';

describe('basic-types', () => {
    test('String', () => {
        const type = Type.from(String);
        assert.isTrue(testType(type, 'string'));
        assert.isFalse(testType(type, {}));
    });

    test('literal', () => {
        const type = Type.from(1);
        assert.isTrue(testType(type, 1));
        assert.isFalse(testType(type, 2));
    });
});
