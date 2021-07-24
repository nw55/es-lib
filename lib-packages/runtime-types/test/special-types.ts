import { testType, Type } from '@nw55/runtime-types';

describe('special-types', () => {
    test('union', () => {
        const type = Type.union(String, Number);
        expect(testType(type, 'string')).toBeTrue();
        expect(testType(type, 123)).toBeTrue();
        expect(testType(type, true)).toBeFalse();
    });

    test('nested union', () => {
        const type = Type.union(String, Type.union(Number, Boolean));
        expect(testType(type, 'string')).toBeTrue();
        expect(testType(type, 123)).toBeTrue();
        expect(testType(type, true)).toBeTrue();
        expect(testType(type, [])).toBeFalse();
    });

    test('intersection', () => {
        const type = Type.intersection({ a: String }, { b: Number });
        expect(testType(type, { a: 'string', b: 123 })).toBeTrue();
        expect(testType(type, { a: 'string' })).toBeFalse();
        expect(testType(type, { b: 123 })).toBeFalse();
    });

    test('nested intersection', () => {
        const type = Type.intersection({ a: String }, Type.intersection({ b: Number }, { c: Boolean }));
        expect(testType(type, { a: 'string', b: 123, c: true })).toBeTrue();
        expect(testType(type, { a: 'string', c: true })).toBeFalse();
    });

    test('optional', () => {
        const type = Type.optional(String);
        expect(testType(type, undefined)).toBeTrue();
        expect(testType(type, 'string')).toBeTrue();
        expect(testType(type, null)).toBeFalse();
        expect(testType(type, 1)).toBeFalse();
    });
});
