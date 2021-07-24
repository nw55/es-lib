import { JsonType, testType } from '@nw55/runtime-types';

describe('json', () => {
    test('primitive', () => {
        expect(testType(JsonType.value, 'string')).toBeTrue();
        expect(testType(JsonType.value, 1)).toBeTrue();
        expect(testType(JsonType.value, true)).toBeTrue();
        expect(testType(JsonType.value, null)).toBeTrue();
        expect(testType(JsonType.value, undefined)).toBeFalse();
    });

    test('array', () => {
        const array = ['string', 1, true];
        expect(testType(JsonType.value, array)).toBeTrue();
        expect(testType(JsonType.array, array)).toBeTrue();
        expect(testType(JsonType.object, array)).toBeFalse();

        const array2 = [undefined];
        expect(testType(JsonType.value, array2)).toBeFalse();
    });

    test('object', () => {
        const object = { a: 'string', b: 1, c: true };
        expect(testType(JsonType.value, object)).toBeTrue();
        expect(testType(JsonType.array, object)).toBeFalse();
        expect(testType(JsonType.object, object)).toBeTrue();

        const object2 = { a: undefined };
        expect(testType(JsonType.value, object2)).toBeFalse();
    });

    test('recursive', () => {
        const object = {
            a: ['string', 1, true],
            b: { c: null }
        };
        expect(testType(JsonType.value, object)).toBeTrue();
        expect(testType(JsonType.array, object)).toBeFalse();
        expect(testType(JsonType.object, object)).toBeTrue();

        const object2 = {
            a: [undefined]
        };
        expect(testType(JsonType.value, object2)).toBeFalse();
    });
});
