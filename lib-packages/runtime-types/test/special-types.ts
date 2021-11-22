import { testType, Type } from '@nw55/runtime-types';
import { expectType } from './_utils';

describe('special-types', () => {
    test('union', () => {
        const type = Type.union(String, Number);
        expect(testType(type, 'string')).toBeTrue();
        expect(testType(type, 123)).toBeTrue();
        expect(testType(type, true)).toBeFalse();

        type Actual = Type.Of<typeof type>;
        type Expected = string | number;
        expectType<Actual, Actual, Expected>();
    });

    test('nested union', () => {
        const type = Type.union(String, Type.union(Number, Boolean));
        expect(testType(type, 'string')).toBeTrue();
        expect(testType(type, 123)).toBeTrue();
        expect(testType(type, true)).toBeTrue();
        expect(testType(type, [])).toBeFalse();

        type Actual = Type.Of<typeof type>;
        type Expected = string | number | boolean;
        expectType<Actual, Actual, Expected>();
    });

    test('intersection', () => {
        const type = Type.intersection({ a: String }, { b: Number });
        expect(testType(type, { a: 'string', b: 123 })).toBeTrue();
        expect(testType(type, { a: 'string' })).toBeFalse();
        expect(testType(type, { b: 123 })).toBeFalse();

        type Actual = Type.Of<typeof type>;
        type Expected = { a: string; } & { b: number; };
        expectType<Actual, Actual, Expected>();
    });

    test('nested intersection', () => {
        const type = Type.intersection({ a: String }, Type.intersection({ b: Number }, { c: Boolean }));
        expect(testType(type, { a: 'string', b: 123, c: true })).toBeTrue();
        expect(testType(type, { a: 'string', c: true })).toBeFalse();

        type Actual = Type.Of<typeof type>;
        type Expected = { a: string; } & { b: number; } & { c: boolean; };
        expectType<Actual, Actual, Expected>();
    });
});
