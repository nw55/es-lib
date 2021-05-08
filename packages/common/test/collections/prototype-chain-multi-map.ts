import { ConstructorLike, PrototypeChainMultiMap } from '@nw55/common';
import { assert } from 'chai';

/* eslint-disable @typescript-eslint/no-extraneous-class -- test classes may be empty */

class T { }
class A extends T { }
class B extends A { }
class C extends T { }
class D { }

const testEntries: [ConstructorLike<T>, string][] = [
    [T, 't1'],
    [T, 't2'],
    [B, 'b1'],
    [B, 'b2'],
    [C, 'c']
];

describe('PrototypeChainMultiMap', () => {
    test('add / has / hasKey / get', () => {
        const map = new PrototypeChainMultiMap<T, string>();
        for (const [key, value] of testEntries)
            map.add(key, value);
        assert.isTrue(map.hasKey(T));
        assert.isFalse(map.hasKey(A));
        assert.isTrue(map.hasKey(B));
        assert.isTrue(map.hasKey(C));
        assert.isTrue(map.has(T, 't1'));
        assert.isFalse(map.has(A, 'a'));
        assert.isFalse(map.has(T, 't3'));
        assert.isTrue(map.has(B, 'b2'));
    });

    test('get / values', () => {
        const map = new PrototypeChainMultiMap<T, string>();
        for (const [key, value] of testEntries)
            map.add(key, value);
        assert.deepEqual([...map.get(T)], ['t1', 't2']);
        assert.deepEqual([...map.get(A)], []);
        assert.deepEqual([...map.get(B)], ['b1', 'b2']);
        assert.deepEqual([...map.get(C)], ['c']);
        assert.deepEqual([...map.values()], ['t1', 't2', 'b1', 'b2', 'c']);
    });

    test('delete / deleteAll / clear / size', () => {
        const map = new PrototypeChainMultiMap<T, string>();
        for (const [key, value] of testEntries)
            map.add(key, value);
        assert.equal(map.size, 5);
        assert.isTrue(map.delete(T, 't2'));
        assert.isFalse(map.deleteAll(A));
        assert.isTrue(map.deleteAll(B));
        assert.isFalse(map.delete(T, 't2'));
        assert.isFalse(map.deleteAll(B));
        assert.equal(map.size, 2);
        map.clear();
        assert.equal(map.size, 0);
    });

    test('find', () => {
        const map = new PrototypeChainMultiMap<T, string>();
        for (const [key, value] of testEntries)
            map.add(key, value);
        assert.deepEqual([...map.find(new T())], ['t1', 't2']);
        assert.deepEqual([...map.find(new B())], ['b1', 'b2', 't1', 't2']);
        assert.deepEqual([...map.find(new D())], []);
    });
});
