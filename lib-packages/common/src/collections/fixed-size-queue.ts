import { CallbackIterable } from '../interfaces';

export class FixedSizeQueue<T = unknown> implements CallbackIterable<T> {
    private _elements: T[];
    private _capacity: number;
    private _writeIndex = 0;
    private _size = 0;

    constructor(capacity: number) {
        this._capacity = capacity;
        this._elements = Array<T>(capacity);
    }

    get capacity() {
        return this._capacity;
    }

    get size() {
        return this._size;
    }

    reset() {
        this._writeIndex = 0;
        this._size = 0;
    }

    clear() {
        this._elements = Array<T>(this._capacity);
        this.reset();
    }

    get next() {
        if (this._size >= this._capacity)
            return undefined;
        const index = (this._writeIndex - this._size + this._capacity) % this._capacity;
        return this._elements[index];
    }

    enqueue(element: T, force = false) {
        if (this._size >= this._capacity) {
            if (!force)
                return false;
            this._size--;
        }
        this._elements[this._writeIndex] = element;
        this._writeIndex = (this._writeIndex + 1) % this._capacity;
        this._size++;
        return true;
    }

    dequeue() {
        if (this._size === 0)
            return undefined;
        const index = (this._writeIndex - this._size + this._capacity) % this._capacity;
        this._size--;
        return this._elements[index];
    }

    forEach(cb: (value: T) => void) {
        for (let c = this._size; c > 0; c--) {
            const i = (this._writeIndex - c + this._capacity) % this._capacity;
            cb(this._elements[i]);
        }
    }

    *[Symbol.iterator]() {
        for (let c = this._size; c > 0; c--) {
            const i = (this._writeIndex - c + this._capacity) % this._capacity;
            yield this._elements[i];
        }
    }
}
