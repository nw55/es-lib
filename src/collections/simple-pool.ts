export class SimplePool<T> {
    private _items: T[] = [];
    private _factory: () => T;
    private _capacity: number;

    constructor(factory: () => T, initialSize = 0, capacity = Infinity) {
        this._factory = factory;

        for (let i = 0; i < initialSize; i++)
            this._items.push(factory());

        this._capacity = capacity;
    }

    get size() {
        return this._items.length;
    }

    get capacity() {
        return this._capacity;
    }

    use() {
        if (this._items.length === 0)
            return this._factory.call(undefined);
        return this._items.pop()!;
    }

    return(obj: T) {
        if (this._items.length < this._capacity)
            this._items.push(obj);
    }
}
