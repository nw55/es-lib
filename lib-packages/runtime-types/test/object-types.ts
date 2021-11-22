import { testType, Type } from '@nw55/runtime-types';
import { expectType } from './_utils';

/* eslint-disable @typescript-eslint/consistent-type-definitions */

describe('object-types', () => {
    test('plain object', () => {
        const type = Type.object({}, {
            a: String
        });
        expect(testType(type, { a: 'string' })).toBeTrue();
        expect(testType(type, { a: 'string', b: 123 })).toBeTrue();
        expect(testType(type, {})).toBeFalse();
        expect(testType(type, { a: 123 })).toBeFalse();

        type Actual = Type.Of<typeof type>;
        type Expected = { a: string; };
        expectType<Actual, Actual, Expected>();
    });

    test('plain object: non-objects', () => {
        const type = Type.object({}, {
            a: String
        });
        expect(testType(type, undefined)).toBeFalse();
        expect(testType(type, null)).toBeFalse();
        expect(testType(type, '')).toBeFalse();
        expect(testType(type, [])).toBeFalse();

        type Actual = Type.Of<typeof type>;
        type Expected = { a: string; };
        expectType<Actual, Actual, Expected>();
    });

    test('plain object: partial', () => {
        const type = Type.object({ partial: true }, {
            a: String
        });
        expect(testType(type, { a: 'string' })).toBeTrue();
        expect(testType(type, {})).toBeTrue();
        expect(testType(type, { a: 123 })).toBeFalse();

        type Actual = Type.Of<typeof type>;
        type Expected = { a?: string; };
        expectType<Actual, Actual, Expected>();
    });

    test('plain object: no excess properties', () => {
        const type = Type.object({ noExcessProperties: true }, {
            a: String
        });
        expect(testType(type, { a: 'string' })).toBeTrue();
        expect(testType(type, {})).toBeFalse();
        expect(testType(type, { a: 'string', b: 'string' })).toBeFalse();

        type Actual = Type.Of<typeof type>;
        type Expected = { a: string; };
        expectType<Actual, Actual, Expected>();
    });

    test('plain object with optional', () => {
        const type = Type.from({
            a: String,
            b: Type.optional(String),
            c: Type.optional(String, true)
        });
        expect(testType(type, { a: 'string', b: 'string', c: 'string' })).toBeTrue();
        expect(testType(type, { a: 'string', b: undefined })).toBeFalse();
        expect(testType(type, { a: 'string', c: undefined })).toBeTrue();
        expect(testType(type, { a: 'string' })).toBeTrue();
        expect(testType(type, { b: 'string' })).toBeFalse();
        expect(testType(type, {})).toBeFalse();

        type Actual = Type.Of<typeof type>;
        type Expected = { a: string; b?: string; c?: string | undefined; };
        expectType<Actual, Actual, Expected>();
    });

    test('record', () => {
        const type = Type.record(Number);
        expect(testType(type, { a: 1, b: 2 })).toBeTrue();
        expect(testType(type, { a: 1 })).toBeTrue();
        expect(testType(type, {})).toBeTrue();
        expect(testType(type, { a: 1, b: 'string' })).toBeFalse();
        expect(testType(type, { a: 'string' })).toBeFalse();

        type Actual = Type.Of<typeof type>;
        type Expected = Record<string, number>;
        expectType<Actual, Actual, Expected>();
    });

    test('record with union key', () => {
        const type = Type.record(Type.union('a', 'b'), Number);
        expect(testType(type, { a: 1, b: 2 })).toBeTrue();
        expect(testType(type, { a: 1, c: 2 })).toBeFalse();
        expect(testType(type, {})).toBeTrue();
        expect(testType(type, { a: 1, b: 'string' })).toBeFalse();
        expect(testType(type, { a: 'string' })).toBeFalse();

        type Actual = Type.Of<typeof type>;
        type Expected = Record<'a' | 'b', number>;
        expectType<Actual, Actual, Expected>();
    });
});
