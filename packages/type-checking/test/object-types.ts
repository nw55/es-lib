import { testType, Type } from '@nw55/type-checking';

describe('object-types', () => {
    test('plain object', () => {
        const type = Type.plainObject({}, {
            a: String
        });
        expect(testType(type, { a: 'string' })).toBeTrue();
        expect(testType(type, { a: 'string', b: 123 })).toBeTrue();
        expect(testType(type, {})).toBeFalse();
        expect(testType(type, { a: 123 })).toBeFalse();
    });

    test('plain object: non-objects', () => {
        const type = Type.plainObject({}, {
            a: String
        });
        expect(testType(type, undefined)).toBeFalse();
        expect(testType(type, null)).toBeFalse();
        expect(testType(type, '')).toBeFalse();
        expect(testType(type, [])).toBeFalse();
    });

    test('plain object: partial', () => {
        const type = Type.plainObject({ partial: true }, {
            a: String
        });
        expect(testType(type, { a: 'string' })).toBeTrue();
        expect(testType(type, {})).toBeTrue();
        expect(testType(type, { a: 123 })).toBeFalse();
    });

    test('plain object: no excess properties', () => {
        const type = Type.plainObject({ noExcessProperties: true }, {
            a: String
        });
        expect(testType(type, { a: 'string' })).toBeTrue();
        expect(testType(type, {})).toBeFalse();
        expect(testType(type, { a: 'string', b: 'string' })).toBeFalse();
    });

    test('plain object with optional', () => {
        const type = Type.from({
            a: String,
            b: Type.optional(String)
        });
        expect(testType(type, { a: 'string', b: 'string' })).toBeTrue();
        expect(testType(type, { a: 'string', b: undefined })).toBeTrue();
        expect(testType(type, { a: 'string' })).toBeTrue();
        expect(testType(type, { b: 'string' })).toBeFalse();
        expect(testType(type, {})).toBeFalse();
    });

    test('record', () => {
        const type = Type.record(Number);
        expect(testType(type, { a: 1, b: 2 })).toBeTrue();
        expect(testType(type, { a: 1 })).toBeTrue();
        expect(testType(type, {})).toBeTrue();
        expect(testType(type, { a: 1, b: 'string' })).toBeFalse();
        expect(testType(type, { a: 'string' })).toBeFalse();
    });

    test('record with union key', () => {
        const type = Type.record(Type.union('a', 'b'), Number);
        expect(testType(type, { a: 1, b: 2 })).toBeTrue();
        expect(testType(type, { a: 1, c: 2 })).toBeFalse();
        expect(testType(type, {})).toBeTrue();
        expect(testType(type, { a: 1, b: 'string' })).toBeFalse();
        expect(testType(type, { a: 'string' })).toBeFalse();
    });
});
