import { AnyRecord, ArgumentError, isArray } from '@nw55/common';
import { CheckableType, RuntimeType } from './common';
import { ArrayType } from './types/array';
import { IntersectionType } from './types/intersection';
import { LiteralType } from './types/literal';
import { ObjectPropertyType, ObjectType } from './types/object';
import { RecordType } from './types/record';
import { RecursiveType } from './types/recursive';
import { TupleType } from './types/tuple';
import { TypeofType } from './types/typeof';
import { UnionType } from './types/union';
import { UnknownType } from './types/unknown';

const optionalSymbol = Symbol();

type PropertyTypeDefinition =
    | TypeDefinition
    | readonly [typeof optionalSymbol, TypeDefinition];

function isOptionalPropertyType(type: PropertyTypeDefinition): type is readonly [typeof optionalSymbol, TypeDefinition] {
    return isArray(type) && type[0] === optionalSymbol;
}

export type TypeDefinition =
    | CheckableType<unknown>
    | RuntimeType<unknown>
    | string | number | boolean | bigint | null | undefined
    | typeof String | typeof Number | typeof Boolean | typeof BigInt
    | readonly TypeDefinition[]
    | { readonly [key: string]: PropertyTypeDefinition; };

type ObjectTypeFromDefinition<T extends Readonly<AnyRecord> | readonly unknown[]> =
    & { -readonly [P in keyof T as typeof optionalSymbol extends keyof T[P] ? never : P]: TypeFromDefinition<T[P]>; }
    & { -readonly [P in keyof T as typeof optionalSymbol extends keyof T[P] ? P : never]?: TypeFromDefinition<T[P]>; };

export type TypeFromDefinition<T> =
    T extends CheckableType<infer U> ? U :
    T extends RuntimeType<infer U> ? U :
    T extends string | number | boolean | null | undefined ? T :
    T extends typeof String ? string :
    T extends typeof Number ? number :
    T extends typeof Boolean ? boolean :
    T extends typeof BigInt ? bigint :
    T extends (Readonly<AnyRecord> | readonly unknown[]) ? ObjectTypeFromDefinition<T> :
    never;

type UnionTypeFromTupleDefinition<T extends unknown[]> = {
    [P in keyof T]: TypeFromDefinition<T[P]>;
}[Exclude<keyof T, keyof []>];

// https://stackoverflow.com/a/50375286
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type IntersectionTypeFromTupleDefinition<T extends unknown[]> = UnionToIntersection<UnionTypeFromTupleDefinition<T>>;

type PartialTypeFromObjectDefinition<T extends AnyRecord> = {
    [P in keyof T]?: TypeFromDefinition<T[P]>;
};

interface PlainObjectOptions {
    noExcessProperties?: boolean | undefined;
    partial?: boolean | undefined;
}

type StringTypeDefinition = typeof String | string | CheckableType<string> | RuntimeType<string>;

export namespace Type {
    export type Of<T> = T extends CheckableType ? CheckableType.ExtractType<T> : never;

    export const literalUndefined = new LiteralType<undefined>(undefined);
    export const literalNull = new LiteralType<null>(null);
    export const literalTrue = new LiteralType<true>(true);
    export const literalFalse = new LiteralType<false>(false);

    function getObjectPropertiesInfo(typeDefinition: { readonly [key: string]: PropertyTypeDefinition; }, isPartial: boolean) {
        return Object.entries(typeDefinition).map<ObjectPropertyType>(([key, value]) => {
            const isOptional = isOptionalPropertyType(value);
            return {
                key,
                type: fromDefinition(isOptional ? value[1] : value),
                optional: isOptional || isPartial
            };
        });
    }

    function fromDefinition(typeDefinition: TypeDefinition): RuntimeType<unknown> {
        const type = typeof typeDefinition;
        if (typeDefinition === null || typeDefinition === undefined || type === 'string' || type === 'number' || type === 'boolean' || type === 'bigint')
            return new LiteralType(typeDefinition);
        if (typeDefinition === String)
            return new TypeofType('string');
        if (typeDefinition === Number)
            return new TypeofType('number');
        if (typeDefinition === Boolean)
            return new TypeofType('boolean');
        if (typeDefinition === BigInt)
            return new TypeofType('bigint');
        if (typeof typeDefinition !== 'object')
            throw new ArgumentError();
        if (typeDefinition instanceof RuntimeType)
            return typeDefinition;
        if (isArray(typeDefinition))
            return new TupleType(typeDefinition.map(fromDefinition));
        return new ObjectType(getObjectPropertiesInfo(typeDefinition, false), false);
    }

    export function from<T extends TypeDefinition>(typeDefinition: T): RuntimeType<TypeFromDefinition<T>> {
        return fromDefinition(typeDefinition);
    }

    export function union<T extends TypeDefinition[]>(...typeDefinitions: T): RuntimeType<UnionTypeFromTupleDefinition<T>> {
        return new UnionType(typeDefinitions.map(fromDefinition));
    }

    export function intersection<T extends TypeDefinition[]>(...typeDefinitions: T): RuntimeType<IntersectionTypeFromTupleDefinition<T>> {
        return new IntersectionType(typeDefinitions.map(fromDefinition));
    }

    export function array<T extends TypeDefinition>(typeDefinition: T): RuntimeType<TypeFromDefinition<T>[]> {
        return new ArrayType(fromDefinition(typeDefinition));
    }

    export function object<T extends Record<string, TypeDefinition>>(options: PlainObjectOptions, typeDefinition: T): RuntimeType<PartialTypeFromObjectDefinition<T>> {
        return new ObjectType(getObjectPropertiesInfo(typeDefinition, options.partial ?? false), options.noExcessProperties ?? false);
    }

    export function partial<T extends Record<string, TypeDefinition>>(typeDefinition: T): RuntimeType<PartialTypeFromObjectDefinition<T>> {
        return object({ partial: true }, typeDefinition);
    }

    export function optional<T extends TypeDefinition>(typeDefinition: T, allowUndefined = false) {
        return [
            optionalSymbol,
            allowUndefined ? union(typeDefinition, literalUndefined) : fromDefinition(typeDefinition)
        ] as const;
    }

    export function record<T extends TypeDefinition>(typeDefinition: T): RuntimeType<Record<string, TypeFromDefinition<T>>>;
    export function record<K extends StringTypeDefinition, V extends TypeDefinition>(keyTypeDefinition: K, valueTypeDefinition: V): RuntimeType<Record<TypeFromDefinition<K>, TypeFromDefinition<V>>>;
    export function record(typeDefinition1: TypeDefinition, typeDefinition2?: TypeDefinition) {
        const keyType = typeDefinition2 === undefined ? uncheckedType : fromDefinition(typeDefinition1);
        const valueType = fromDefinition(typeDefinition2 === undefined ? typeDefinition1 : typeDefinition2);
        return new RecordType(keyType, valueType);
    }

    const uncheckedType: CheckableType = {
        [CheckableType.check]() {
            return { success: true, errors: [] };
        }
    };

    export function unchecked<T>() {
        return new UnknownType<T>(uncheckedType);
    }

    export const unknown = unchecked<unknown>();

    export function recursive<T>(create: (type: RuntimeType<T>) => RuntimeType<T>) {
        const { type, resolve } = RecursiveType.create<T>();
        resolve(create(type));
        return type;
    }
}
