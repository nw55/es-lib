import { CheckableType } from './common';
import { Type } from './type';

type JsonValue = string | number | boolean | null | { [property: string]: JsonValue; } | JsonValue[];

export type JsonTypeDefinition =
    CheckableType<JsonValue>
    | string | number | boolean | null
    | typeof String | typeof Number | typeof Boolean
    | readonly JsonTypeDefinition[]
    | { readonly [key: string]: JsonTypeDefinition; };

export namespace JsonType {
    export const unchecked = Type.unchecked<JsonValue>();

    const valueRef = Type.recursiveRef<JsonValue>();
    export const value = valueRef.checkableType;
    export const array = Type.array(value);
    export const object = Type.record(value);
    valueRef.resolve(Type.union(String, Number, Boolean, Type.literalNull, array, object));
}
