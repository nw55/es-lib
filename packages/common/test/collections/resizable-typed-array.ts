import { ResizableTypedArray } from '@nw55/common';

describe('ResizableTypedArray', () => {
    test('append / grow', () => {
        const resizable = new ResizableTypedArray(Uint8Array, { capacity: 3, growFactor: 2, size: 2 });
        expect(resizable.size).toBe(2);
        expect(resizable.capacity).toBe(3);
        resizable.appendValue(0);
        expect(resizable.size).toBe(3);
        expect(resizable.capacity).toBe(3);
        resizable.appendValue(0);
        expect(resizable.size).toBe(4);
        expect(resizable.capacity).toBe(6);
    });

    test('set size / shrink', () => {
        const resizable = new ResizableTypedArray(Uint8Array, { capacity: 3, growFactor: 2, size: 2, shrinkFactor: 2 });
        expect(resizable.size).toBe(2);
        expect(resizable.capacity).toBe(3);
        resizable.size = 10;
        expect(resizable.size).toBe(10);
        expect(resizable.capacity).toBe(12);
        resizable.size = 2;
        expect(resizable.size).toBe(2);
        expect(resizable.capacity).toBe(3);
    });

    test('requireSize', () => {
        const resizable = new ResizableTypedArray(Uint8Array, { capacity: 3, growFactor: 2 });
        expect(resizable.size).toBe(0);
        expect(resizable.capacity).toBe(3);
        resizable.requireSize(5);
        expect(resizable.size).toBe(5);
        expect(resizable.capacity).toBe(6);
        resizable.requireSize(3);
        expect(resizable.size).toBe(5);
        expect(resizable.capacity).toBe(6);

        const resizableNoGrow = new ResizableTypedArray(Uint8Array, { capacity: 3, growFactor: 0 });
        expect(resizableNoGrow.size).toBe(0);
        expect(resizableNoGrow.capacity).toBe(3);
        expect(() => resizableNoGrow.requireSize(5)).toThrow();
        expect(resizableNoGrow.size).toBe(0);
        expect(resizableNoGrow.capacity).toBe(3);
    });
});
