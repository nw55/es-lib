import { ArgumentError, BitArray } from '@nw55/common';

describe('BitArray', () => {
    test('length', () => {
        const array = new BitArray(5);
        expect(array.length).toBe(5);
    });

    test('index out of range', () => {
        const array = new BitArray(5);
        expect(() => array.get(-1)).toThrow(ArgumentError);
        expect(() => array.get(5)).toThrow(ArgumentError);
        expect(() => array.set(-1)).toThrow(ArgumentError);
        expect(() => array.set(5)).toThrow(ArgumentError);
    });

    test('get / set', () => {
        const array = new BitArray(5);
        expect(array.get(0)).toBeFalse();
        array.set(0);
        expect(array.get(0)).toBeTrue();
    });

    test('nonemptyEntries', () => {
        const input = new Uint32Array([0, 1, 0, 2, 3]);
        const array = BitArray.nonemptyEntries(input, 4);
        expect(array.length).toBe(4);
        expect(array.get(0)).toBeFalse();
        expect(array.get(1)).toBeTrue();
        expect(array.get(2)).toBeFalse();
        expect(array.get(3)).toBeTrue();
    });
});
