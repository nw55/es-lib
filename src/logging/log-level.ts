import { ArgumentError } from '../errors';

const logLevelData = [
    ['all', 'All', false], // 0
    ['trace', 'Trace', false], // 1
    ['verbose', 'Verbose', false], // 2
    ['debug', 'Debug', false], // 3
    ['info', 'Information', false], // 4
    ['notice', 'Notice', false], // 5
    ['warn', 'Warning', true], // 6
    ['error', 'Error', true], // 7
    ['critical', 'Critical', true], // 8
    ['fatal', 'Fatal', true] // 9
] as const;

type LogLevelData = (typeof logLevelData)[number];

export namespace LogLevelKeys {
    export type All = LogLevelData[0];
    export type Info = Extract<LogLevelData, readonly [unknown, unknown, false]>[0];
    export type Error = Extract<LogLevelData, readonly [unknown, unknown, true]>[0];
}

export type LogLevelKeys = LogLevelKeys.All;

export interface LogLevel<Key extends LogLevelKeys = LogLevelKeys> {
    readonly key: Key;
    readonly code: number;
    readonly name: string;
    readonly symbol: string;
    readonly isError: boolean;
}

function createLogLevel<Key extends LogLevelKeys>(key: Key, code: number, name: string, isError: boolean) {
    return Object.create(null, {
        key: { enumerable: true, value: key },
        code: { enumerable: true, value: code },
        name: { enumerable: true, value: name },
        symbol: { enumerable: true, value: name.charAt(0) },
        isError: { enumerable: true, value: isError },
        valueOf: { value(this: LogLevel<Key>) { return this.code; } },
        toString: { value(this: LogLevel<Key>) { return this.name; } }
    }) as LogLevel<Key>;
}

const logLevels = logLevelData.map(([key, name, isError], index) => createLogLevel(key, index, name, isError));
const logLevelsByKey = new Map(logLevels.map(logLevel => [logLevel.key, logLevel]));

interface LogLevelObjectMethods {
    fromKey<Key extends LogLevelKeys>(key: Key): LogLevel<Key>;

    fromCode(code: number): LogLevel;
}

type LogLevelObjectProperties = {
    [P in LogLevelData[1]]: LogLevel<Extract<LogLevelData, readonly [unknown, P]>[0]>;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const LogLevel: LogLevelObjectMethods & LogLevelObjectProperties = {
    fromKey<Key extends LogLevelKeys>(key: Key) {
        const level = logLevelsByKey.get(key);
        if (level === undefined)
            throw new ArgumentError();
        return level as LogLevel<Key>;
    },
    fromCode(code: number) {
        code = Math.min(Math.max(0, code | 0), logLevels.length - 1);
        return logLevels[code];
    },
    ...Object.fromEntries(logLevels.map(logLevel => [logLevel.name, logLevel])) as LogLevelObjectProperties
};
