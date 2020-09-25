import { JsonValue } from '@nw55/common';
import { Type } from './type';

export namespace JsonType {
    export const unchecked = Type.unchecked<JsonValue>();

    const valueRef = Type.recursiveRef<JsonValue>();
    export const value = valueRef.checkableType;
    export const array = Type.array(value);
    export const object = Type.record(value);
    valueRef.resolve(Type.union(String, Number, Boolean, Type.literalNull, array, object));
}
