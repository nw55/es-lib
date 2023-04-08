import { Awaitable } from './utils.js';

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export class PromiseSource<T = void> {
    private _resolve!: (value: T | PromiseLike<T>) => void;
    private _reject!: (reason?: any) => void;
    private _promise: Promise<T>;
    private _pending = true;

    constructor() {
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    get promise() {
        return this._promise;
    }

    get pending() {
        return this._pending;
    }

    resolve(value: Awaitable<T>) {
        if (this._pending) {
            this._pending = false;
            this._resolve(value);
        }
    }

    reject(reason?: unknown) {
        if (this._pending) {
            this._pending = false;
            this._reject(reason);
        }
    }
}
