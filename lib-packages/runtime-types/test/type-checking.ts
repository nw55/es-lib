import { requireType, testType, Type } from '@nw55/runtime-types';

describe('type-checking', () => {
    test('unchecked', () => {
        const type = Type.unchecked<unknown>();
        expect(testType(type, 1)).toBeTrue();
        expect(testType(type, '')).toBeTrue();
        expect(testType(type, {})).toBeTrue();
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
        expect(testType(type, matchingValue)).toBeTrue();
        expect(testType(type, failingValue)).toBeFalse();
        requireType(type, matchingValue);
        expect(() => requireType(type, failingValue)).toThrow();
    });
});
