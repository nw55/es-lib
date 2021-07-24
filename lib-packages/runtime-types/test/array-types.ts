import { testType, Type } from '@nw55/runtime-types';

describe('array-types', () => {
    test('array', () => {
        const type = Type.array(String);
        expect(testType(type, [])).toBeTrue();
        expect(testType(type, ['str'])).toBeTrue();
        expect(testType(type, [123])).toBeFalse();
    });

    test('tuple', () => {
        const type = Type.from([String, Number] as const);
        expect(testType(type, ['a', 1])).toBeTrue();
        expect(testType(type, ['a'])).toBeFalse();
        expect(testType(type, ['a', 1, 2])).toBeFalse();
    });
});
