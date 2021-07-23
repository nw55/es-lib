import { FixedSizeQueue } from '@nw55/common';

describe('FixedSizeQueue', () => {
    test('basic enqueue / dequeue / size', () => {
        const queue = new FixedSizeQueue<string>(3);
        expect(queue.dequeue()).toBeUndefined();
        expect(queue.size).toBe(0);
        queue.enqueue('a');
        queue.enqueue('b');
        expect(queue.size).toBe(2);
        expect(queue.dequeue()).toBe('a');
        expect(queue.size).toBe(1);
        queue.enqueue('c');
        expect(queue.size).toBe(2);
        expect(queue.dequeue()).toBe('b');
        expect(queue.dequeue()).toBe('c');
        expect(queue.size).toBe(0);
    });

    test('enqueue capacity limit', () => {
        const queue = new FixedSizeQueue<string>(1);
        queue.enqueue('a');
        expect(queue.size).toBe(1);
        expect(queue.enqueue('b')).toBeFalse();
        expect(queue.enqueue('c', true)).toBeTrue();
        expect(queue.dequeue()).toBe('c');
        expect(queue.size).toBe(0);
    });

    test('next / iterable', () => {
        const queue = new FixedSizeQueue<string>(3);
        queue.enqueue('a');
        expect(queue.next).toBe('a');
        queue.dequeue();
        expect(queue.next).toBeUndefined();
        queue.enqueue('b');
        expect(queue.next).toBe('b');
        queue.enqueue('c');
        expect(queue.next).toBe('b');
        queue.enqueue('d');
        queue.dequeue();
        queue.enqueue('e');
        expect([...queue]).toEqual(['c', 'd', 'e']);
    });
});
