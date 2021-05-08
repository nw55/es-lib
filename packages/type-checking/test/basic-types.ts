import { testType, Type } from '@nw55/type-checking';

describe('basic-types', () => {
    test('String', () => {
        const type = Type.from(String);
        expect(testType(type, 'string')).toBeTrue();
        expect(testType(type, {})).toBeFalse();
    });

    test('literal', () => {
        const type = Type.from(1);
        expect(testType(type, 1)).toBeTrue();
        expect(testType(type, 2)).toBeFalse();
    });
});
