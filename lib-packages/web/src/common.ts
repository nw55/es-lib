export class HttpError extends Error {
    declare readonly name = 'HttpError';

    constructor(public readonly status: number, message?: string, public readonly cause?: Error) {
        super(message);
    }
}
Object.defineProperty(HttpError.prototype, 'name', { value: 'HttpError' });
