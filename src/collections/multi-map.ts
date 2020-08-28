const emptyIteratorResult: IteratorResult<any> = {
    done: true,
    value: undefined
};
Object.freeze(emptyIteratorResult);

const emptyIterableIterator: IterableIterator<any> = {
    next() { return emptyIteratorResult; },
    [Symbol.iterator]() { return this; }
};
Object.freeze(emptyIterableIterator);

interface MultiMapOptions {
    readonly maxEmptySets: number;
}

export class MultiMap<K, V> {
    static add<K, V>(map: Map<K, Set<V>>, key: K, value: V) {
        const inner = map.get(key);
        if (inner === undefined) {
            const newInner = new Set([value]);
            map.set(key, newInner);
            return true;
        }
        const oldSize = inner.size;
        inner.add(value);
        return inner.size !== oldSize;
    }

    private _map = new Map<K, Set<V>>();
    private _size = 0;

    private _emptySets = 0;
    private _mapEmptySets: number;

    constructor(items?: Iterable<[K, V]>, options?: MultiMapOptions) {
        this._mapEmptySets = options?.maxEmptySets ?? 8;

        if (items) {
            for (const [key, value] of items)
                this.add(key, value);
        }
    }

    get size() {
        return this._size;
    }

    hasKey(key: K) {
        const inner = this._map.get(key);
        if (inner === undefined)
            return false;
        return inner.size > 0;
    }

    has(key: K, value: V) {
        const inner = this._map.get(key);
        if (inner === undefined)
            return false;
        return inner.has(value);
    }

    get(key: K): Iterable<V> {
        const inner = this._map.get(key);
        if (inner === undefined)
            return emptyIterableIterator;
        return inner;
    }

    add(key: K, value: V) {
        const inner = this._map.get(key);
        if (inner === undefined) {
            const newInner = new Set([value]);
            this._map.set(key, newInner);
            this._size++;
        }
        else {
            const oldSize = inner.size;
            inner.add(value);
            if (inner.size !== oldSize) {
                if (oldSize === 0)
                    this._emptySets--;
                this._size++;
            }
        }
        return this;
    }

    deleteAll(key: K) {
        const inner = this._map.get(key);
        if (inner !== undefined && inner.size > 0) {
            this._size -= inner.size;
            if (this._emptySets < this._mapEmptySets) {
                inner.clear();
                this._emptySets++;
            }
            else {
                this._map.delete(key);
            }
            return true;
        }
        return false;
    }

    delete(key: K, value: V) {
        const inner = this._map.get(key);
        if (inner === undefined)
            return false;
        const success = inner.delete(value);
        if (success) {
            this._size--;
            if (inner.size === 0) {
                if (this._emptySets < this._mapEmptySets)
                    this._emptySets++;
                else
                    this._map.delete(key);
            }
        }
        return success;
    }

    clear() {
        this._map.clear();
        this._size = 0;
        this._emptySets = 0;
    }

    [Symbol.iterator]() {
        return this.entries();
    }

    *entries(): IterableIterator<[K, V]> {
        for (const [key, values] of this._map) {
            for (const value of values)
                yield [key, value];
        }
    }

    *groupedEntries(): IterableIterator<[K, IterableIterator<V>]> {
        for (const [key, values] of this._map)
            yield [key, values.values()];
    }

    keys(): IterableIterator<K> {
        return this._map.keys();
    }

    *values() {
        for (const values of this._map.values()) {
            for (const value of values)
                yield value;
        }
    }

    forEach(cb: (key: K, value: V, map: this) => void) {
        for (const [key, values] of this._map) {
            for (const value of values)
                cb(key, value, this);
        }
    }
}
