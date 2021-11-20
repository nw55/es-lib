import { TypedArray } from '../utils';

interface ResizableTypedArrayOptions {
    size?: number | undefined;
    capacity: number;
    growFactor?: number | undefined;
    shrinkFactor?: number | undefined;
}

type TypedArrayConstructor<T extends TypedArray> = new (size: number) => T;

export class ResizableTypedArray<T extends TypedArray> {
    private _type: TypedArrayConstructor<T>;
    private _data: T;
    private _size: number;
    private _growFactor: number;
    private _shrinkFactor: number;

    constructor(type: TypedArrayConstructor<T>, options: ResizableTypedArrayOptions);
    constructor(type: TypedArrayConstructor<T>, capacity: number); // eslint-disable-line @typescript-eslint/unified-signatures
    constructor(type: TypedArrayConstructor<T>, options: ResizableTypedArrayOptions | number) {
        this._type = type;
        if (typeof options === 'number')
            options = { capacity: options };
        this._size = options.size ?? 0;
        this._data = new type(options.capacity);
        this._growFactor = options.growFactor ?? 2;
        this._shrinkFactor = options.shrinkFactor ?? 0;
    }

    get capacity() {
        return this._data.length;
    }

    get size() {
        return this._size;
    }
    set size(v: number) {
        this._setSize(v);
    }

    private _setSize(size: number) {
        size |= 0;
        if (this._size === size)
            return;
        if (size > this._data.length) {
            if (this._growFactor > 1) {
                let newCapacity = this._data.length;
                while (newCapacity < size)
                    newCapacity = Math.round(newCapacity * this._growFactor);
                const newData = new this._type(newCapacity);
                newData.set(this._data);
                this._data = newData;
            }
            else {
                throw new Error(`size ${size} exceeds capacity ${this.capacity}`);
            }
        }
        else if (this._shrinkFactor > 1) {
            if (size * this._shrinkFactor < this._data.length) {
                let newCapacity = this._data.length;
                while (newCapacity > size * this._shrinkFactor)
                    newCapacity = Math.ceil(newCapacity / this._shrinkFactor);
                this._data = this._data.slice(0, newCapacity) as T;
            }
        }
        this._size = size;
    }

    get data() {
        return this._data;
    }

    requireSize(size: number) {
        if (size > this._size)
            this._setSize(size);
    }

    appendValue(value: number) {
        const index = this.size++;
        this._data[index] = value;
    }

    createView(begin = 0, end = this._size) {
        return this._data.subarray(begin, end) as T;
    }
}
