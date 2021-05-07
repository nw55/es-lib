import { ArgumentError, LogLevelInfo, LogLevelKeys } from '@nw55/common';
import { LogFilter } from './filter';

export class LogLevel<K extends LogLevelKeys = LogLevelKeys> implements LogLevelInfo, LogFilter {
    private static _byKey = new Map<LogLevelKeys, LogLevel>();
    private static _byValue = new Map<number, LogLevel>();

    /* eslint-disable @typescript-eslint/naming-convention */
    static readonly All = new LogLevel('all', 0, 'All', false);
    static readonly Trace = new LogLevel('trace', 1, 'Trace', false);
    static readonly Debug = new LogLevel('debug', 2, 'Debug', false);
    static readonly Verbose = new LogLevel('verbose', 3, 'Verbose', false);
    static readonly Information = new LogLevel('info', 4, 'Information', false);
    static readonly Notice = new LogLevel('notice', 5, 'Notice', false);
    static readonly Warning = new LogLevel('warn', 6, 'Warning', true);
    static readonly Error = new LogLevel('error', 7, 'Error', true);
    static readonly Critical = new LogLevel('critical', 8, 'Critical', true);
    static readonly Fatal = new LogLevel('fatal', 9, 'Fatal', true);
    /* eslint-enable @typescript-eslint/naming-convention */

    static get allLevels() {
        return this._byKey.values();
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    static get<K extends LogLevelKeys>(key: K | LogLevelInfo<K>): LogLevel<K> {
        if (typeof key === 'string')
            return LogLevel.fromKey(key);
        return LogLevel.fromKey(key.key);
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    static fromKey<K extends LogLevelKeys>(key: K): LogLevel<K> {
        const level = LogLevel._byKey.get(key);
        if (level === undefined)
            throw new ArgumentError();
        return level as LogLevel<K>;
    }

    static fromValue(value: number): LogLevel {
        const level = LogLevel._byValue.get(value);
        if (level === undefined)
            throw new ArgumentError();
        return level;
    }

    private _key: K;
    private _value: number;
    private _name: string;
    private _symbol: string;
    private _isError: boolean;

    constructor(key: K, value: number, name: string, isError: boolean) {
        this._key = key;
        this._value = value;
        this._name = name;
        this._symbol = name.charAt(0);
        this._isError = isError;

        LogLevel._byKey.set(key, this);
        LogLevel._byValue.set(value, this);
    }

    get key() {
        return this._key;
    }

    get value() {
        return this._value;
    }

    get name() {
        return this._name;
    }

    get symbol() {
        return this._symbol;
    }

    get isError() {
        return this._isError;
    }

    shouldLog(level: LogLevel) {
        return level._value >= this._value;
    }

    shouldLogMessage(message: { level: LogLevel; }) {
        return this.shouldLog(message.level);
    }

    valueOf() {
        return this._value;
    }

    toString() {
        return 'LogLevel.' + this._name;
    }
}
