import { TwoWayMap } from '@nw55/common';

const testItems: [string, string][] = [
    ['a', 'b'],
    ['a', 'c'],
    ['d', 'e'],
    ['f', 'e']
];

describe('TwoWayMap', () => {
    test('constructor / hasKey / hasValue', () => {
        const map = new TwoWayMap(testItems);
        expect(map.hasKey('a')).toBeTrue();
        expect(map.hasKey('f')).toBeTrue();
        expect(map.hasKey('d')).toBeFalse();
        expect(map.hasValue('c')).toBeTrue();
        expect(map.hasValue('e')).toBeTrue();
        expect(map.hasValue('b')).toBeFalse();
    });

    test('set / getValue / getKey', () => {
        const map = new TwoWayMap<string, string>();
        for (const [k, v] of testItems)
            map.set(k, v);
        expect(map.getValue('a')).toBe('c');
        expect(map.getValue('f')).toBe('e');
        expect(map.getValue('d')).toBeUndefined();
        expect(map.getKey('c')).toBe('a');
        expect(map.getKey('e')).toBe('f');
        expect(map.getKey('b')).toBeUndefined();
    });

    test('delete / deleteValue / clear / size', () => {
        const map = new TwoWayMap(testItems);
        expect(map.size).toBe(2);
        expect(map.delete('a')).toBeTrue();
        expect(map.deleteValue('e')).toBeTrue();
        expect(map.delete('a')).toBeFalse();
        expect(map.deleteValue('e')).toBeFalse();
        expect(map.size).toBe(0);
        map.set('a', 'b');
        map.clear();
        expect(map.size).toBe(0);
    });

    test('iterator / entries / inverseEntries / keys / values', () => {
        const map = new TwoWayMap(testItems);
        expect([...map]).toEqual([
            ['a', 'c'],
            ['f', 'e']
        ]);
        expect([...map.entries()]).toEqual([
            ['a', 'c'],
            ['f', 'e']
        ]);
        expect([...map.inverseEntries()]).toEqual([
            ['c', 'a'],
            ['e', 'f']
        ]);
        expect([...map.keys()]).toEqual(['a', 'f']);
        expect([...map.values()]).toEqual(['c', 'e']);
    });
});
