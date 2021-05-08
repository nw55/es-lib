import { FixedSizeQueue } from '@nw55/common';
import { assert } from 'chai';

describe('FixedSizeQueue', () => {
    test('basic enqueue / dequeue / size', () => {
        const queue = new FixedSizeQueue<string>(3);
        assert.isUndefined(queue.dequeue());
        assert.equal(queue.size, 0);
        queue.enqueue('a');
        queue.enqueue('b');
        assert.equal(queue.size, 2);
        assert.equal(queue.dequeue(), 'a');
        assert.equal(queue.size, 1);
        queue.enqueue('c');
        assert.equal(queue.size, 2);
        assert.equal(queue.dequeue(), 'b');
        assert.equal(queue.dequeue(), 'c');
        assert.equal(queue.size, 0);
    });

    test('enqueue capacity limit', () => {
        const queue = new FixedSizeQueue<string>(1);
        queue.enqueue('a');
        assert.equal(queue.size, 1);
        assert.isFalse(queue.enqueue('b'));
        assert.isTrue(queue.enqueue('c', true));
        assert.equal(queue.dequeue(), 'c');
        assert.equal(queue.size, 0);
    });

    test('next / iterable', () => {
        const queue = new FixedSizeQueue<string>(3);
        queue.enqueue('a');
        assert.equal(queue.next, 'a');
        queue.dequeue();
        assert.isUndefined(queue.next);
        queue.enqueue('b');
        assert.equal(queue.next, 'b');
        queue.enqueue('c');
        assert.equal(queue.next, 'b');
        queue.enqueue('d');
        queue.dequeue();
        queue.enqueue('e');
        assert.deepEqual([...queue], ['c', 'd', 'e']);
    });
});
