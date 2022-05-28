export class ArgumentError extends Error {
    declare readonly name: 'ArgumentError';
}
Object.defineProperty(ArgumentError.prototype, 'name', { value: 'ArgumentError' });

export class NotImplementedError extends Error {
    declare readonly name = 'NotImplementedError';
}
Object.defineProperty(NotImplementedError.prototype, 'name', { value: 'NotImplementedError' });

export class FailedAssertionError extends Error {
    declare readonly name = 'FailedAssertionError';
}
Object.defineProperty(FailedAssertionError.prototype, 'name', { value: 'FailedAssertionError' });

export class UnexpectedError extends Error {
    declare readonly name = 'UnexpectedError';
}
Object.defineProperty(UnexpectedError.prototype, 'name', { value: 'UnexpectedError' });

export class InvalidOperationError extends Error {
    declare readonly name = 'InvalidOperationError';
}
Object.defineProperty(InvalidOperationError.prototype, 'name', { value: 'InvalidOperationError' });

export class LoggerStackTraceError extends Error {
    declare readonly name = 'LoggerStackTraceError';
}
Object.defineProperty(LoggerStackTraceError.prototype, 'name', { value: 'LoggerStackTraceError' });
