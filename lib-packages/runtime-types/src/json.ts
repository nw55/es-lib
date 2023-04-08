import { CheckableType, RuntimeType } from './common.js';
import { Type } from './type.js';
import { RecursiveType } from './types.js';

export type JsonTypeDefinition =
    | CheckableType<JsonType.Value>
    | RuntimeType<JsonType.Value>
    | string | number | boolean | null
    | typeof String | typeof Number | typeof Boolean
    | readonly JsonTypeDefinition[]
    | { readonly [key: string]: JsonTypeDefinition; };

export namespace JsonType {
    // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/array-type
    export type Value = string | number | boolean | null | Object | Array;
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    export type Object = { [property: string]: Value; };
    export type Array = Value[];

    export const unchecked = Type.unchecked<Value>();

    const valueRef = RecursiveType.create<Value>();
    export const value = valueRef.type;
    export const array = Type.array(value);
    export const object = Type.record(value);
    valueRef.resolve(Type.union(String, Number, Boolean, Type.literalNull, array, object));
}
