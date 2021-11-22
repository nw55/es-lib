import { ArrayType, testType, TupleType, Type } from '@nw55/runtime-types';
import { expectType } from './_utils';

describe('array-types', () => {
    test('array', () => {
        const type = Type.array(String);
        expect(testType(type, [])).toBeTrue();
        expect(testType(type, ['str'])).toBeTrue();
        expect(testType(type, [123])).toBeFalse();
        expect(type).toBeInstanceOf(ArrayType);

        type Actual = Type.Of<typeof type>;
        type Expected = string[];
        expectType<Actual, Actual, Expected>();
    });

    test('tuple', () => {
        const type = Type.from([String, Number] as const);
        expect(testType(type, ['a', 1])).toBeTrue();
        expect(testType(type, ['a'])).toBeFalse();
        expect(testType(type, ['a', 1, 2])).toBeFalse();
        expect(type).toBeInstanceOf(TupleType);

        type Actual = Type.Of<typeof type>;
        type Expected = [string, number];
        expectType<Actual, Actual, Expected>();
    });
});
