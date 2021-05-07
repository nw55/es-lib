import { ArgumentError, BitArray } from '@nw55/common';
import { assert } from 'chai';
import { describe, test } from 'mocha';

describe('BitArray', () => {
    test('length', () => {
        const array = new BitArray(5);
        assert.equal(array.length, 5);
    });

    test('index out of range', () => {
        const array = new BitArray(5);
        assert.throws(() => array.get(-1), ArgumentError);
        assert.throws(() => array.get(5), ArgumentError);
        assert.throws(() => array.set(-1), ArgumentError);
        assert.throws(() => array.set(5), ArgumentError);
    });

    test('get / set', () => {
        const array = new BitArray(5);
        assert.isFalse(array.get(0));
        array.set(0);
        assert.isTrue(array.get(0));
    });

    test('nonemptyEntries', () => {
        const input = new Uint32Array([0, 1, 0, 2, 3]);
        const array = BitArray.nonemptyEntries(input, 4);
        assert.equal(array.length, 4);
        assert.isFalse(array.get(0));
        assert.isTrue(array.get(1));
        assert.isFalse(array.get(2));
        assert.isTrue(array.get(3));
    });
});
