import { ConstructorLike } from '../utils.js';
import { MultiMap } from './multi-map.js';

/* eslint-disable @typescript-eslint/ban-types -- object is allowed in this file */

export class PrototypeChainMultiMap<K extends object, V> {
    private _map = new MultiMap<object, V>();

    get size() {
        return this._map.size;
    }

    has(key: ConstructorLike<K>, value: V) {
        return this._map.has(key.prototype, value);
    }

    hasKey(key: ConstructorLike<K>) {
        return this._map.hasKey(key.prototype);
    }

    get(key: ConstructorLike<K>) {
        return this._map.get(key.prototype);
    }

    add(key: ConstructorLike<K>, value: V) {
        this._map.add(key.prototype, value);
    }

    delete(key: ConstructorLike<K>, value: V) {
        return this._map.delete(key.prototype, value);
    }

    deleteAll(key: ConstructorLike<K>) {
        return this._map.deleteAll(key.prototype);
    }

    clear() {
        this._map.clear();
    }

    *find(obj: K) {
        let prototype = Object.getPrototypeOf(obj) as object | null;
        while (prototype !== null) {
            yield* this._map.get(prototype);
            prototype = Object.getPrototypeOf(prototype) as object | null;
        }
    }

    values() {
        return this._map.values();
    }
}
