import { MultiMap, type LogLevel } from '@nw55/common';

export interface LogLevelMetadata {
    readonly key: LogLevel;
    readonly name: string;
    readonly symbol: string;
    readonly isError: boolean;
    readonly parents: readonly LogLevel[];
}

function createMetadata(key: LogLevel, name: string, isError: boolean, ...parents: LogLevel[]): LogLevelMetadata {
    return Object.freeze({
        key,
        name,
        symbol: name.charAt(0),
        isError,
        parents: Object.freeze(parents)
    });
}

// NOTE: the order in this object determines the priorities in getInheritedLogLevelProperties for cases with multiple children
export const logLevelMetadata: Readonly<Record<LogLevel, LogLevelMetadata>> = Object.freeze({
    'trace': createMetadata('trace', 'Trace', false, 'debug'),
    'debug': createMetadata('debug', 'Debug', false, 'verbose', 'debugAlert'),
    'verbose': createMetadata('verbose', 'Verbose', false, 'info'),
    'info': createMetadata('info', 'Info', false, 'notice'),
    'debugAlert': createMetadata('debugAlert', 'DebugAlert', false, 'debugWarn'),
    // notice before debugWarn
    'notice': createMetadata('notice', 'Notice', false, 'alert', 'warn'),
    'debugWarn': createMetadata('debugWarn', 'DebugWarning', true, 'warn'),
    // warn before alert
    'warn': createMetadata('warn', 'Warning', true, 'error'),
    'alert': createMetadata('alert', 'Alert', false, 'error'),
    'error': createMetadata('error', 'Error', true, 'critical'),
    'critical': createMetadata('critical', 'Critical', true)
});

// includes reflexive and transitive links in the log level hierarchy
const allIncludedLevels = new MultiMap<LogLevel, LogLevel>();

const childrenByLevel = new MultiMap<LogLevel, LogLevel>();

function addIncludedLevels(key: LogLevel, metadata: LogLevelMetadata) {
    allIncludedLevels.add(key, metadata.key);
    for (const parent of metadata.parents)
        addIncludedLevels(key, logLevelMetadata[parent]);
}

for (const metadata of Object.values(logLevelMetadata)) {
    addIncludedLevels(metadata.key, metadata);
    for (const parent of metadata.parents)
        childrenByLevel.add(parent, metadata.key);
}

export function isLogLevelIncluded(condition: LogLevel, level: LogLevel) {
    return allIncludedLevels.has(condition, level);
}

export function getAllIncludedLogLevels(...conditions: LogLevel[]): ReadonlySet<LogLevel> {
    if (conditions.length === 1)
        return allIncludedLevels.get(conditions[0]);
    const result = new Set<LogLevel>();
    for (const condition of conditions) {
        for (const level of allIncludedLevels.get(condition))
            result.add(level);
    }
    return result;
}

export type LogLevelProperties<T> = Record<LogLevel, T>;
export type PartialLogLevelProperties<T> = Partial<Record<LogLevel, T>>;

export function getInheritedLogLevelProperties<D extends {}, T extends {} = D>(properties: PartialLogLevelProperties<T>, defaultValue: D): LogLevelProperties<T | D> {
    const result = {} as Record<LogLevel, T | D>; // eslint-disable-line @typescript-eslint/consistent-type-assertions

    function rec(level: LogLevel): T | undefined {
        if (properties[level] !== undefined)
            return properties[level];
        for (const childLevel of childrenByLevel.get(level)) {
            const value = rec(childLevel);
            if (value !== undefined)
                return value;
        }
        return undefined;
    }

    for (const metadata of Object.values(logLevelMetadata)) {
        const value = rec(metadata.key);
        result[metadata.key] = value ?? defaultValue;
    }

    return result;
}
