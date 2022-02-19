export class ApiError extends Error {
    declare readonly name = 'ApiError';

    constructor(public readonly status: number, message?: string, public readonly cause?: Error) {
        super(message);
    }
}
Object.defineProperty(ApiError.prototype, 'name', { value: 'ApiError' });
