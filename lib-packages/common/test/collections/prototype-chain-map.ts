import { PrototypeChainMap } from '@nw55/common';

/* eslint-disable @typescript-eslint/no-extraneous-class -- test classes may be empty */

class T { }
class A extends T { }
class B extends A { }
class C extends T { }
class D { }

describe('PrototypeChainMap', () => {
    test('get / set / has', () => {
        const map = new PrototypeChainMap<T, string>();
        map.set(T, 't');
        map.set(B, 'b');
        map.set(C, 'c');
        expect(map.has(T)).toBeTrue();
        expect(map.has(A)).toBeFalse();
        expect(map.has(B)).toBeTrue();
        expect(map.has(C)).toBeTrue();
        expect(map.get(T)).toBe('t');
        expect(map.get(A)).toBeUndefined();
        expect(map.get(B)).toBe('b');
        expect(map.get(C)).toBe('c');
    });

    test('delete / clear / size / values', () => {
        const map = new PrototypeChainMap<T, string>();
        map.set(T, 't');
        map.set(B, 'b');
        map.set(C, 'c');
        expect(map.size).toBe(3);
        expect([...map.values()]).toEqual(['t', 'b', 'c']);
        expect(map.delete(T)).toBeTrue();
        expect(map.delete(A)).toBeFalse();
        expect(map.delete(B)).toBeTrue();
        expect(map.delete(T)).toBeFalse();
        expect(map.delete(B)).toBeFalse();
        expect(map.size).toBe(1);
        expect([...map.values()]).toEqual(['c']);
        map.clear();
        expect(map.size).toBe(0);
        expect([...map.values()]).toEqual([]);
    });

    test('find / finAll', () => {
        const map = new PrototypeChainMap<T, string>();
        map.set(T, 't');
        map.set(A, 'a');
        map.set(C, 'c');
        expect(map.find(new T())).toBe('t');
        expect(map.find(new B())).toBe('a');
        expect(map.find(new D())).toBeUndefined();
        expect([...map.findAll(new T())]).toEqual(['t']);
        expect([...map.findAll(new B())]).toEqual(['a', 't']);
        expect([...map.findAll(new D())]).toEqual([]);
    });
});
