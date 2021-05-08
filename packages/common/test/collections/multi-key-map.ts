import { MultiKeyMap } from '@nw55/common';

const testItems: [string, string, string][] = [
    ['a', 'b', 'c'],
    ['a', 'b', 'd'],
    ['a', 'e', 'f'],
    ['g', 'h', 'i']
];

describe('MultiKeyMap', () => {
    test('constructor / has / hasAny / get', () => {
        const map = new MultiKeyMap(testItems);
        expect(map.has('a', 'b')).toBeTrue();
        expect(map.has('g', 'h')).toBeTrue();
        expect(map.has('a', 'h')).toBeFalse();
        expect(map.hasAny('a')).toBeTrue();
        expect(map.hasAny('b')).toBeFalse();
        expect(map.get('a', 'c')).toBeUndefined();
        expect(map.get('a', 'b')).toBe('d');
        expect(map.get('g', 'h')).toBe('i');
    });

    test('set / getKeys / getAll / getValues', () => {
        const map = new MultiKeyMap<string, string, string>();
        for (const [k1, k2, v] of testItems)
            map.set(k1, k2, v);
        expect([...map.getKeys('a')]).toEqual(['b', 'e']);
        expect([...map.getKeys('b')]).toEqual([]);
        expect([...map.getAll('a')]).toEqual([['b', 'd'], ['e', 'f']]);
        expect([...map.getValues('a')]).toEqual(['d', 'f']);
    });

    test('delete / deleteAll / clear / size', () => {
        const map = new MultiKeyMap(testItems);
        expect(map.size).toBe(3);
        expect(map.delete('a', 'b')).toBeTrue();
        expect(map.deleteAll('g')).toBeTrue();
        expect(map.delete('a', 'b')).toBeFalse();
        expect(map.deleteAll('g')).toBeFalse();
        expect(map.size).toBe(1);
        map.clear();
        expect(map.size).toBe(0);
    });

    test('iterator / entries / groupedEntries / keys / keyPairs / values', () => {
        const map = new MultiKeyMap(testItems);
        expect([...map]).toEqual([
            ['a', 'b', 'd'],
            ['a', 'e', 'f'],
            ['g', 'h', 'i']
        ]);
        expect([...map.entries()]).toEqual([
            ['a', 'b', 'd'],
            ['a', 'e', 'f'],
            ['g', 'h', 'i']
        ]);
        expect([...map.groupedEntries()].map(([key, values]) => [key, [...values]])).toEqual([
            ['a', [['b', 'd'], ['e', 'f']]],
            ['g', [['h', 'i']]]
        ]);
        expect([...map.keys()]).toEqual(['a', 'g']);
        expect([...map.keysPairs()]).toEqual([
            ['a', 'b'],
            ['a', 'e'],
            ['g', 'h']
        ]);
        expect([...map.values()]).toEqual(['d', 'f', 'i']);
    });
});
