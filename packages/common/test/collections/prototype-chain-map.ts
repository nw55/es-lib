import { PrototypeChainMap } from '@nw55/common';
import { assert } from 'chai';

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
        assert.isTrue(map.has(T));
        assert.isFalse(map.has(A));
        assert.isTrue(map.has(B));
        assert.isTrue(map.has(C));
        assert.equal(map.get(T), 't');
        assert.isUndefined(map.get(A));
        assert.equal(map.get(B), 'b');
        assert.equal(map.get(C), 'c');
    });

    test('delete / clear / size / values', () => {
        const map = new PrototypeChainMap<T, string>();
        map.set(T, 't');
        map.set(B, 'b');
        map.set(C, 'c');
        assert.equal(map.size, 3);
        assert.deepEqual([...map.values()], ['t', 'b', 'c']);
        assert.isTrue(map.delete(T));
        assert.isFalse(map.delete(A));
        assert.isTrue(map.delete(B));
        assert.isFalse(map.delete(T));
        assert.isFalse(map.delete(B));
        assert.equal(map.size, 1);
        assert.deepEqual([...map.values()], ['c']);
        map.clear();
        assert.equal(map.size, 0);
        assert.deepEqual([...map.values()], []);
    });

    test('find / finAll', () => {
        const map = new PrototypeChainMap<T, string>();
        map.set(T, 't');
        map.set(A, 'a');
        map.set(C, 'c');
        assert.equal(map.find(new T()), 't');
        assert.equal(map.find(new B()), 'a');
        assert.isUndefined(map.find(new D()));
        assert.deepEqual([...map.findAll(new T())], ['t']);
        assert.deepEqual([...map.findAll(new B())], ['a', 't']);
        assert.deepEqual([...map.findAll(new D())], []);
    });
});
