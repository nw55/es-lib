import { SimplePool } from '@nw55/common';
import { assert } from 'chai';
import { describe, test } from 'mocha';

function createTestFactory() {
    let next = 0;
    return () => next++;
}

describe('SimplePool', () => {
    test('size / use / return', () => {
        const factory = createTestFactory();
        const pool = new SimplePool<number>(factory);
        assert.equal(pool.capacity, Infinity);
        assert.equal(pool.size, 0);
        const item1 = pool.use();
        const item2 = pool.use();
        assert.equal(item1, 0);
        assert.equal(item2, 1);
        assert.equal(pool.size, 0);
        pool.return(item1);
        assert.equal(pool.size, 1);
        const item3 = pool.use();
        assert.equal(pool.size, 0);
        assert.equal(item3, 0);
    });

    test('initialSize', () => {
        const factory = createTestFactory();
        const pool = new SimplePool<number>(factory, 2);
        assert.equal(pool.size, 2);
        assert.equal(factory(), 2);
    });

    test('return exceeding capacity', () => {
        const factory = createTestFactory();
        const pool = new SimplePool<number>(factory, 0, 2);
        assert.equal(pool.capacity, 2);
        const item1 = pool.use();
        const item2 = pool.use();
        const item3 = pool.use();
        pool.return(item1);
        pool.return(item2);
        pool.return(item3);
        assert.equal(pool.size, 2);
        const items = [pool.use(), pool.use()];
        assert.sameMembers(items, [0, 1]);
    });
});
