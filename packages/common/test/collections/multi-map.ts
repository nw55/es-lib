import { MultiMap } from '@nw55/common';
import { assert } from 'chai';
import { describe, test } from 'mocha';

const testItems: [string, string][] = [
    ['a', 'b'],
    ['a', 'c'],
    ['d', 'e']
];

describe('MultiMap', () => {
    test('constructor / hasKey / has', () => {
        const map = new MultiMap(testItems);
        assert.isTrue(map.has('a', 'b'));
        assert.isTrue(map.has('d', 'e'));
        assert.isFalse(map.has('a', 'e'));
        assert.isTrue(map.hasKey('a'));
        assert.isFalse(map.hasKey('b'));
    });

    test('add / get', () => {
        const map = new MultiMap<string, string>();
        for (const [k, v] of testItems)
            map.add(k, v);
        assert.deepEqual([...map.get('a')], ['b', 'c']);
        assert.deepEqual([...map.get('b')], []);
    });

    test('delete / deleteAll / clear / size', () => {
        const map = new MultiMap(testItems);
        assert.equal(map.size, 3);
        assert.isTrue(map.delete('a', 'b'));
        assert.isTrue(map.deleteAll('d'));
        assert.isFalse(map.delete('a', 'b'));
        assert.isFalse(map.deleteAll('d'));
        assert.equal(map.size, 1);
        map.clear();
        assert.equal(map.size, 0);
    });

    test('iterator / entries / groupedEntries / keys / values', () => {
        const map = new MultiMap(testItems);
        assert.deepEqual([...map], testItems);
        assert.deepEqual([...map.entries()], testItems);
        assert.deepEqual([...map.groupedEntries()].map(([key, values]) => [key, [...values]]), [
            ['a', ['b', 'c']],
            ['d', ['e']]
        ]);
        assert.deepEqual([...map.keys()], ['a', 'd']);
        assert.deepEqual([...map.values()], ['b', 'c', 'e']);
    });

    test('static add', () => {
        const map = new Map<string, Set<string>>();
        for (const [k, v] of testItems)
            MultiMap.add(map, k, v);
        assert.deepEqual([...map], [
            ['a', new Set(['b', 'c'])],
            ['d', new Set(['e'])]
        ]);
    });
});
