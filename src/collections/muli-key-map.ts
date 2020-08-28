const emptyMap: ReadonlyMap<any, any> = new Map();

interface MultiKeyMapOptions {
    readonly maxEmptyInnerMaps: number;
}

export class MultiKeyMap<K1, K2, V> {
    private _map = new Map<K1, Map<K2, V>>();
    private _size = 0;
    private _emptyInnerMaps = 0;
    private _maxEmptyInnerMaps: number;

    constructor(elements?: Iterable<[K1, K2, V]>, options?: MultiKeyMapOptions) {
        this._maxEmptyInnerMaps = options?.maxEmptyInnerMaps ?? 8;

        if (elements !== undefined) {
            for (const [key1, key2, value] of elements)
                this.set(key1, key2, value);
        }
    }

    get size() {
        return this._size;
    }

    hasAny(key1: K1) {
        const inner = this._map.get(key1);
        if (inner === undefined)
            return false;
        return inner.size > 0;
    }

    has(key1: K1, key2: K2) {
        const inner = this._map.get(key1);
        if (inner === undefined)
            return false;
        return inner.has(key2);
    }

    getKeys(key1: K1): IterableIterator<K2> {
        const inner = this._map.get(key1);
        if (inner === undefined)
            return emptyMap.keys();
        return inner.keys();
    }

    getAll(key1: K1): ReadonlyMap<K2, V> {
        const inner = this._map.get(key1);
        if (inner === undefined)
            return emptyMap;
        return inner;
    }

    getValues(key1: K1) {
        const inner = this._map.get(key1);
        if (inner === undefined)
            return emptyMap.values();
        return inner.values();
    }

    get(key1: K1, key2: K2) {
        const inner = this._map.get(key1);
        if (inner === undefined)
            return undefined;
        return inner.get(key2);
    }

    set(key1: K1, key2: K2, value: V) {
        const inner = this._map.get(key1);
        if (inner === undefined) {
            const newInner = new Map();
            newInner.set(key2, value);
            this._map.set(key1, newInner);
            this._size++;
        }
        else {
            const oldSize = inner.size;
            inner.set(key2, value);
            if (inner.size !== oldSize) {
                if (oldSize === 0)
                    this._emptyInnerMaps--;
                this._size++;
            }
        }
        return this;
    }

    deleteAll(key1: K1) {
        const inner = this._map.get(key1);
        if (inner !== undefined && inner.size > 0) {
            this._size -= inner.size;
            if (this._emptyInnerMaps < this._maxEmptyInnerMaps) {
                inner.clear();
                this._emptyInnerMaps++;
            }
            else {
                this._map.delete(key1);
            }
            return true;
        }
        return false;
    }

    delete(key1: K1, key2: K2) {
        const inner = this._map.get(key1);
        if (inner === undefined)
            return false;
        const success = inner.delete(key2);
        if (success) {
            this._size--;
            if (inner.size === 0) {
                if (this._emptyInnerMaps < this._maxEmptyInnerMaps)
                    this._emptyInnerMaps++;
                else
                    this._map.delete(key1);
            }
        }
        return success;
    }

    clear() {
        this._map.clear();
        this._size = 0;
        this._emptyInnerMaps = 0;
    }

    [Symbol.iterator]() {
        return this.entries();
    }

    *entries(): IterableIterator<[K1, K2, V]> {
        for (const [key1, inner] of this._map) {
            for (const [key2, value] of inner)
                yield [key1, key2, value];
        }
    }

    groupedEntries(): IterableIterator<[K1, ReadonlyMap<K2, V>]> {
        return this._map.entries();
    }

    keys() {
        return this._map.keys();
    }

    *keysPairs(): IterableIterator<[K1, K2]> {
        for (const [key1, inner] of this._map) {
            for (const key2 of inner.keys())
                yield [key1, key2];
        }
    }

    *values() {
        for (const inner of this._map.values())
            yield* inner.values();
    }

    forEach(cb: (value: V, key1: K1, key2: K2, map: this) => void) {
        for (const [key1, inner] of this._map) {
            for (const [key2, value] of inner)
                cb(value, key1, key2, this);
        }
    }
}
