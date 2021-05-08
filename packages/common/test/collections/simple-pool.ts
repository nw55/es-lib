import { SimplePool } from '@nw55/common';

function createTestFactory() {
    let next = 0;
    return () => next++;
}

describe('SimplePool', () => {
    test('size / use / return', () => {
        const factory = createTestFactory();
        const pool = new SimplePool<number>(factory);
        expect(pool.capacity).toBe(Infinity);
        expect(pool.size).toBe(0);
        const item1 = pool.use();
        const item2 = pool.use();
        expect(item1).toBe(0);
        expect(item2).toBe(1);
        expect(pool.size).toBe(0);
        pool.return(item1);
        expect(pool.size).toBe(1);
        const item3 = pool.use();
        expect(pool.size).toBe(0);
        expect(item3).toBe(0);
    });

    test('initialSize', () => {
        const factory = createTestFactory();
        const pool = new SimplePool<number>(factory, 2);
        expect(pool.size).toBe(2);
        expect(factory()).toBe(2);
    });

    test('return exceeding capacity', () => {
        const factory = createTestFactory();
        const pool = new SimplePool<number>(factory, 0, 2);
        expect(pool.capacity).toBe(2);
        const item1 = pool.use();
        const item2 = pool.use();
        const item3 = pool.use();
        pool.return(item1);
        pool.return(item2);
        pool.return(item3);
        expect(pool.size).toBe(2);
        const items = [pool.use(), pool.use()];
        expect(items).toIncludeSameMembers([0, 1]);
    });
});
