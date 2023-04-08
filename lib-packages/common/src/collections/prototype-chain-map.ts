import { ConstructorLike } from '../utils.js';

/* eslint-disable @typescript-eslint/ban-types -- object is allowed in this file */

export class PrototypeChainMap<K extends object, V> {
    private _map = new Map<object, V>();

    get size() {
        return this._map.size;
    }

    has(key: ConstructorLike<K>) {
        return this._map.has(key.prototype);
    }

    get(key: ConstructorLike<K>) {
        return this._map.get(key.prototype);
    }

    set(key: ConstructorLike<K>, value: V) {
        this._map.set(key.prototype, value);
    }

    delete(key: ConstructorLike<K>) {
        return this._map.delete(key.prototype);
    }

    clear() {
        this._map.clear();
    }

    find(obj: K, predicate?: (value: V) => boolean) {
        let prototype = Object.getPrototypeOf(obj) as object | null;
        while (prototype !== null) {
            const value = this._map.get(prototype);
            if (value !== undefined && (predicate === undefined || predicate(value)))
                return value;
            prototype = Object.getPrototypeOf(prototype) as object | null;
        }
        return undefined;
    }

    *findAll(obj: K) {
        let prototype = Object.getPrototypeOf(obj) as object | null;
        while (prototype !== null) {
            const value = this._map.get(prototype);
            if (value !== undefined)
                yield value;
            prototype = Object.getPrototypeOf(prototype) as object | null;
        }
    }

    values() {
        return this._map.values();
    }
}
