import { isArray, LogLevel, LogSource } from '@nw55/common';
import { LogEntry } from './common.js';
import { getAllIncludedLogLevels, isLogLevelIncluded } from './log-level-metadata.js';

export interface LogFilter {
    shouldLog(level: LogLevel, source: LogSource): boolean;

    shouldLogEntry(entry: LogEntry): boolean;
}

type LogFilterFunction = LogFilter['shouldLog'];

const nothingLogFilter: LogFilter = {
    shouldLog: () => false,
    shouldLogEntry: () => false
};

const everythingLogFilter: LogFilter = {
    shouldLog: () => true,
    shouldLogEntry: () => true
};

export type LogFilterResolvable = LogFilter | LogFilterFunction | LogLevel[] | LogLevel | boolean;

export function createLogFilter(filter: LogFilterResolvable): LogFilter {
    if (typeof filter === 'boolean')
        return filter ? everythingLogFilter : nothingLogFilter;

    if (typeof filter === 'function') {
        return {
            shouldLog: filter,
            shouldLogEntry: entry => filter(entry.level, entry.source)
        };
    }

    if (typeof filter === 'string') {
        return {
            shouldLog: level => isLogLevelIncluded(filter, level),
            shouldLogEntry: entry => isLogLevelIncluded(filter, entry.level)
        };
    }

    if (isArray(filter)) {
        const levels = getAllIncludedLogLevels(...filter);
        return {
            shouldLog: level => levels.has(level),
            shouldLogEntry: entry => levels.has(entry.level)
        };
    }

    return filter;
}

interface TreeNode {
    children?: Map<string, TreeNode>;
    filter?: LogFilter;
}

export class SourcePrefixLogFilter implements LogFilter {
    static fromStringMap(defaultFilter: LogFilterResolvable, map: Record<string, LogFilterResolvable>, separator = '/') {
        const filters: [string[], LogFilter][] = [];
        for (const [prefix, filter] of Object.entries(map)) {
            const segments = prefix.split(separator);
            filters.push([segments, createLogFilter(filter)]);
        }
        return new SourcePrefixLogFilter(createLogFilter(defaultFilter), filters);
    }

    private _defaultFilter: LogFilter;
    private _nodes = new Map<string, TreeNode>();
    private _arrayCache = new WeakMap<readonly string[], LogFilter>();

    constructor(defaultFilter: LogFilter | boolean, filters: readonly [string | readonly string[], LogFilter][]) {
        this._defaultFilter = createLogFilter(defaultFilter);

        for (const [prefix, filter] of filters) {
            if (isArray(prefix))
                this._addToTree(prefix, filter);
            else
                this._addToTree([prefix], filter);
        }
    }

    private _addToTree(source: readonly string[], filter: LogFilter) {
        const node = this._getCreateNode(this._nodes, source, 0);
        node.filter = filter;
    }

    private _getCreateNode(nodes: Map<string, TreeNode>, source: readonly string[], index: number): TreeNode {
        const level = source[index];
        let node = nodes.get(level);
        if (node === undefined) {
            node = {};
            nodes.set(level, node);
        }
        if (index >= source.length - 1)
            return node;
        if (node.children === undefined)
            node.children = new Map();
        return this._getCreateNode(node.children, source, index + 1);
    }

    private _getFilter(source: LogSource): LogFilter {
        if (source === null)
            return this._defaultFilter;

        if (!isArray(source)) {
            const node = this._nodes.get(source);
            return node?.filter ?? this._defaultFilter;
        }

        const cachedFilter = this._arrayCache.get(source);
        if (cachedFilter !== undefined)
            return cachedFilter;

        let lastFilter = this._defaultFilter;
        let currentNodes = this._nodes;
        for (const level of source) {
            const node = currentNodes.get(level);
            if (node === undefined)
                break;
            if (node.filter !== undefined)
                lastFilter = node.filter;
            if (node.children === undefined)
                break;
            currentNodes = node.children;
        }

        this._arrayCache.set(source, lastFilter);
        return lastFilter;
    }

    shouldLog(level: LogLevel, source: LogSource) {
        return this._getFilter(source).shouldLog(level, source);
    }

    shouldLogEntry(entry: LogEntry) {
        return this._getFilter(entry.source).shouldLogEntry(entry);
    }
}
