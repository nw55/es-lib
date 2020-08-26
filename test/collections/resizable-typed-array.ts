import { ResizableTypedArray } from '@nw55/common';
import { assert } from 'chai';
import { describe, test } from 'mocha';

describe('resizable-typed-array', () => {
    test('append / grow', () => {
        const resizable = new ResizableTypedArray(Uint8Array, { capacity: 3, growFactor: 2, size: 2 });
        assert.equal(resizable.size, 2);
        assert.equal(resizable.capacity, 3);
        resizable.appendValue(0);
        assert.equal(resizable.size, 3);
        assert.equal(resizable.capacity, 3);
        resizable.appendValue(0);
        assert.equal(resizable.size, 4);
        assert.equal(resizable.capacity, 6);
    });

    test('set size / shrink', () => {
        const resizable = new ResizableTypedArray(Uint8Array, { capacity: 3, growFactor: 2, size: 2, shrinkFactor: 2 });
        assert.equal(resizable.size, 2);
        assert.equal(resizable.capacity, 3);
        resizable.size = 10;
        assert.equal(resizable.size, 10);
        assert.equal(resizable.capacity, 12);
        resizable.size = 2;
        assert.equal(resizable.size, 2);
        assert.equal(resizable.capacity, 3);
    });

    test('requireSize', () => {
        const resizable = new ResizableTypedArray(Uint8Array, { capacity: 3, growFactor: 2 });
        assert.equal(resizable.size, 0);
        assert.equal(resizable.capacity, 3);
        resizable.requireSize(5);
        assert.equal(resizable.size, 5);
        assert.equal(resizable.capacity, 6);
        resizable.requireSize(3);
        assert.equal(resizable.size, 5);
        assert.equal(resizable.capacity, 6);

        const resizableNoGrow = new ResizableTypedArray(Uint8Array, { capacity: 3, growFactor: 0 });
        assert.equal(resizableNoGrow.size, 0);
        assert.equal(resizableNoGrow.capacity, 3);
        assert.throws(() => resizableNoGrow.requireSize(5));
        assert.equal(resizableNoGrow.size, 0);
        assert.equal(resizableNoGrow.capacity, 3);
    });
});
