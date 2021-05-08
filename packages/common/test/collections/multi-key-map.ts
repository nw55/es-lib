import { MultiKeyMap } from '@nw55/common';
import { assert } from 'chai';

const testItems: [string, string, string][] = [
    ['a', 'b', 'c'],
    ['a', 'b', 'd'],
    ['a', 'e', 'f'],
    ['g', 'h', 'i']
];

describe('MultiKeyMap', () => {
    test('constructor / has / hasAny / get', () => {
        const map = new MultiKeyMap(testItems);
        assert.isTrue(map.has('a', 'b'));
        assert.isTrue(map.has('g', 'h'));
        assert.isFalse(map.has('a', 'h'));
        assert.isTrue(map.hasAny('a'));
        assert.isFalse(map.hasAny('b'));
        assert.isUndefined(map.get('a', 'c'));
        assert.equal(map.get('a', 'b'), 'd');
        assert.equal(map.get('g', 'h'), 'i');
    });

    test('set / getKeys / getAll / getValues', () => {
        const map = new MultiKeyMap<string, string, string>();
        for (const [k1, k2, v] of testItems)
            map.set(k1, k2, v);
        assert.deepEqual([...map.getKeys('a')], ['b', 'e']);
        assert.deepEqual([...map.getKeys('b')], []);
        assert.deepEqual([...map.getAll('a')], [['b', 'd'], ['e', 'f']]);
        assert.deepEqual([...map.getValues('a')], ['d', 'f']);
    });

    test('delete / deleteAll / clear / size', () => {
        const map = new MultiKeyMap(testItems);
        assert.equal(map.size, 3);
        assert.isTrue(map.delete('a', 'b'));
        assert.isTrue(map.deleteAll('g'));
        assert.isFalse(map.delete('a', 'b'));
        assert.isFalse(map.deleteAll('g'));
        assert.equal(map.size, 1);
        map.clear();
        assert.equal(map.size, 0);
    });

    test('iterator / entries / groupedEntries / keys / keyPairs / values', () => {
        const map = new MultiKeyMap(testItems);
        assert.deepEqual([...map], [
            ['a', 'b', 'd'],
            ['a', 'e', 'f'],
            ['g', 'h', 'i']
        ]);
        assert.deepEqual([...map.entries()], [
            ['a', 'b', 'd'],
            ['a', 'e', 'f'],
            ['g', 'h', 'i']
        ]);
        assert.deepEqual([...map.groupedEntries()].map(([key, values]) => [key, [...values]]), [
            ['a', [['b', 'd'], ['e', 'f']]],
            ['g', [['h', 'i']]]
        ]);
        assert.deepEqual([...map.keys()], ['a', 'g']);
        assert.deepEqual([...map.keysPairs()], [
            ['a', 'b'],
            ['a', 'e'],
            ['g', 'h']
        ]);
        assert.deepEqual([...map.values()], ['d', 'f', 'i']);
    });
});
