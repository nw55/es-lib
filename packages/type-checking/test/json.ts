import { JsonType, testType } from '@nw55/type-checking';
import { assert } from 'chai';

describe('json', () => {
    test('primitive', () => {
        assert.isTrue(testType(JsonType.value, 'string'));
        assert.isTrue(testType(JsonType.value, 1));
        assert.isTrue(testType(JsonType.value, true));
        assert.isTrue(testType(JsonType.value, null));
        assert.isFalse(testType(JsonType.value, undefined));
    });

    test('array', () => {
        const array = ['string', 1, true];
        assert.isTrue(testType(JsonType.value, array));
        assert.isTrue(testType(JsonType.array, array));
        assert.isFalse(testType(JsonType.object, array));

        const array2 = [undefined];
        assert.isFalse(testType(JsonType.value, array2));
    });

    test('object', () => {
        const object = { a: 'string', b: 1, c: true };
        assert.isTrue(testType(JsonType.value, object));
        assert.isFalse(testType(JsonType.array, object));
        assert.isTrue(testType(JsonType.object, object));

        const object2 = { a: undefined };
        assert.isFalse(testType(JsonType.value, object2));
    });

    test('recursive', () => {
        const object = {
            a: ['string', 1, true],
            b: { c: null }
        };
        assert.isTrue(testType(JsonType.value, object));
        assert.isFalse(testType(JsonType.array, object));
        assert.isTrue(testType(JsonType.object, object));

        const object2 = {
            a: [undefined]
        };
        assert.isFalse(testType(JsonType.value, object2));
    });
});
