import { MultiMap } from '@nw55/common';

const testItems: [string, string][] = [
    ['a', 'b'],
    ['a', 'c'],
    ['d', 'e']
];

describe('MultiMap', () => {
    test('constructor / hasKey / has', () => {
        const map = new MultiMap(testItems);
        expect(map.has('a', 'b')).toBeTrue();
        expect(map.has('d', 'e')).toBeTrue();
        expect(map.has('a', 'e')).toBeFalse();
        expect(map.hasKey('a')).toBeTrue();
        expect(map.hasKey('b')).toBeFalse();
    });

    test('add / get', () => {
        const map = new MultiMap<string, string>();
        for (const [k, v] of testItems)
            map.add(k, v);
        expect([...map.get('a')]).toEqual(['b', 'c']);
        expect([...map.get('b')]).toEqual([]);
    });

    test('delete / deleteAll / clear / size', () => {
        const map = new MultiMap(testItems);
        expect(map.size).toBe(3);
        expect(map.delete('a', 'b')).toBeTrue();
        expect(map.deleteAll('d')).toBeTrue();
        expect(map.delete('a', 'b')).toBeFalse();
        expect(map.deleteAll('d')).toBeFalse();
        expect(map.size).toBe(1);
        map.clear();
        expect(map.size).toBe(0);
    });

    test('iterator / entries / groupedEntries / keys / values', () => {
        const map = new MultiMap(testItems);
        expect([...map]).toEqual(testItems);
        expect([...map.entries()]).toEqual(testItems);
        expect([...map.groupedEntries()].map(([key, values]) => [key, [...values]])).toEqual([
            ['a', ['b', 'c']],
            ['d', ['e']]
        ]);
        expect([...map.keys()]).toEqual(['a', 'd']);
        expect([...map.values()]).toEqual(['b', 'c', 'e']);
    });

    test('static add', () => {
        const map = new Map<string, Set<string>>();
        for (const [k, v] of testItems)
            MultiMap.add(map, k, v);
        expect([...map]).toEqual([
            ['a', new Set(['b', 'c'])],
            ['d', new Set(['e'])]
        ]);
    });
});
