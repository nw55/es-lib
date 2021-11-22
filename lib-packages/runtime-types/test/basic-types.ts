import { testType, Type } from '@nw55/runtime-types';
import { expectType } from './_utils';

describe('basic-types', () => {
    test('String', () => {
        const type = Type.from(String);
        expect(testType(type, 'string')).toBeTrue();
        expect(testType(type, {})).toBeFalse();

        type Actual = Type.Of<typeof type>;
        type Expected = string;
        expectType<Actual, Actual, Expected>();
    });

    test('literal', () => {
        const type = Type.from(1);
        expect(testType(type, 1)).toBeTrue();
        expect(testType(type, 2)).toBeFalse();

        type Actual = Type.Of<typeof type>;
        type Expected = 1;
        expectType<Actual, Actual, Expected>();
    });
});
