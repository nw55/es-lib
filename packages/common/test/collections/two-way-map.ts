import { TwoWayMap } from '@nw55/common';
import { assert } from 'chai';

const testItems: [string, string][] = [
    ['a', 'b'],
    ['a', 'c'],
    ['d', 'e'],
    ['f', 'e']
];

describe('TwoWayMap', () => {
    test('constructor / hasKey / hasValue', () => {
        const map = new TwoWayMap(testItems);
        assert.isTrue(map.hasKey('a'));
        assert.isTrue(map.hasKey('f'));
        assert.isFalse(map.hasKey('d'));
        assert.isTrue(map.hasValue('c'));
        assert.isTrue(map.hasValue('e'));
        assert.isFalse(map.hasValue('b'));
    });

    test('set / getValue / getKey', () => {
        const map = new TwoWayMap<string, string>();
        for (const [k, v] of testItems)
            map.set(k, v);
        assert.equal(map.getValue('a'), 'c');
        assert.equal(map.getValue('f'), 'e');
        assert.isUndefined(map.getValue('d'));
        assert.equal(map.getKey('c'), 'a');
        assert.equal(map.getKey('e'), 'f');
        assert.isUndefined(map.getKey('b'));
    });

    test('delete / deleteValue / clear / size', () => {
        const map = new TwoWayMap(testItems);
        assert.equal(map.size, 2);
        assert.isTrue(map.delete('a'));
        assert.isTrue(map.deleteValue('e'));
        assert.isFalse(map.delete('a'));
        assert.isFalse(map.deleteValue('e'));
        assert.equal(map.size, 0);
        map.set('a', 'b');
        map.clear();
        assert.equal(map.size, 0);
    });

    test('iterator / entries / inverseEntries / keys / values', () => {
        const map = new TwoWayMap(testItems);
        assert.deepEqual([...map], [
            ['a', 'c'],
            ['f', 'e']
        ]);
        assert.deepEqual([...map.entries()], [
            ['a', 'c'],
            ['f', 'e']
        ]);
        assert.deepEqual([...map.inverseEntries()], [
            ['c', 'a'],
            ['e', 'f']
        ]);
        assert.deepEqual([...map.keys()], ['a', 'f']);
        assert.deepEqual([...map.values()], ['c', 'e']);
    });
});
