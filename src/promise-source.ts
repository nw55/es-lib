// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type PromiseResolveArgs<T> = T extends void ? [result?: undefined] : [result: T];

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export class PromiseSource<T = void> {
    private _resolve!: (result?: T) => void;
    private _reject!: (error: any) => void;
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

    resolve(...args: PromiseResolveArgs<T>): void;
    resolve(result?: T) {
        if (this._pending) {
            this._pending = false;
            this._resolve(result);
        }
    }

    reject(error?: unknown) {
        if (this._pending) {
            this._pending = false;
            this._reject(error);
        }
    }
}
