import { ConstructorLike, PrototypeChainMultiMap } from '@nw55/common';

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
        expect(map.hasKey(T)).toBeTrue();
        expect(map.hasKey(A)).toBeFalse();
        expect(map.hasKey(B)).toBeTrue();
        expect(map.hasKey(C)).toBeTrue();
        expect(map.has(T, 't1')).toBeTrue();
        expect(map.has(A, 'a')).toBeFalse();
        expect(map.has(T, 't3')).toBeFalse();
        expect(map.has(B, 'b2')).toBeTrue();
    });

    test('get / values', () => {
        const map = new PrototypeChainMultiMap<T, string>();
        for (const [key, value] of testEntries)
            map.add(key, value);
        expect([...map.get(T)]).toEqual(['t1', 't2']);
        expect([...map.get(A)]).toEqual([]);
        expect([...map.get(B)]).toEqual(['b1', 'b2']);
        expect([...map.get(C)]).toEqual(['c']);
        expect([...map.values()]).toEqual(['t1', 't2', 'b1', 'b2', 'c']);
    });

    test('delete / deleteAll / clear / size', () => {
        const map = new PrototypeChainMultiMap<T, string>();
        for (const [key, value] of testEntries)
            map.add(key, value);
        expect(map.size).toBe(5);
        expect(map.delete(T, 't2')).toBeTrue();
        expect(map.deleteAll(A)).toBeFalse();
        expect(map.deleteAll(B)).toBeTrue();
        expect(map.delete(T, 't2')).toBeFalse();
        expect(map.deleteAll(B)).toBeFalse();
        expect(map.size).toBe(2);
        map.clear();
        expect(map.size).toBe(0);
    });

    test('find', () => {
        const map = new PrototypeChainMultiMap<T, string>();
        for (const [key, value] of testEntries)
            map.add(key, value);
        expect([...map.find(new T())]).toEqual(['t1', 't2']);
        expect([...map.find(new B())]).toEqual(['b1', 'b2', 't1', 't2']);
        expect([...map.find(new D())]).toEqual([]);
    });
});
