import { CheckableType, TypeCheckError, TypeCheckResult } from './common.js';

const NESTED_MESSAGE_INDENT = '  ';

function formatPathSegment(path: string | number, withDot = false) {
    if (typeof path === 'string' && /^[A-Za-z_$][\w$]*$/.test(path))
        return (withDot ? '.' : '') + path;
    return `[${String(path)}]`;
}

function formatNestedMessage(indent: string, error: TypeCheckError): string {
    let message = `${indent}Type mismatch${error.path !== null ? ` at ${formatPathSegment(error.path)}` : ''}: ${error.message}`;
    for (const nestedError of error.nestedErrors)
        message += '\n' + formatNestedMessage(indent + NESTED_MESSAGE_INDENT, nestedError);
    return message;
}

function formatFirstNestedMessage(result: TypeCheckResult) {
    if (result.errors.length === 0)
        return '';
    let currentError = result.errors[0];
    let path = '';
    while (true) {
        if (currentError.path !== null)
            path += formatPathSegment(currentError.path, path.length > 0);
        if (currentError.nestedErrors.length === 0)
            break;
        currentError = currentError.nestedErrors[0];
    }
    return `Type mismatch${path !== '' ? ` at ${path}` : ''}: ${currentError.message}`;
}

function formatErrorMessage(result: TypeCheckResult, baseMessage: string) {
    let message = baseMessage;
    for (const error of result.errors)
        message += '\n' + formatNestedMessage('', error);
    return message;
}

export function testType<T extends CheckableType>(type: T, value: unknown): value is CheckableType.ExtractType<T> {
    const result = type[CheckableType.check](value, { returnEarly: true, returnDetails: false });
    return result.success;
}

export function requireType<T extends CheckableType>(type: T, value: unknown, detailedError = false): asserts value is CheckableType.ExtractType<T> {
    const result = type[CheckableType.check](value, { returnEarly: true, returnDetails: true });
    if (!result.success) {
        const message = detailedError
            ? formatErrorMessage(result, 'The specified value does not match the required type.')
            : formatFirstNestedMessage(result);
        throw new TypeError(message);
    }
}
