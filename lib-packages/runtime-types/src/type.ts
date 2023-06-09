import { ArgumentError, isArray, type AnyRecord, type SimplifyObjectType, type UnionToIntersection } from '@nw55/common';
import { CheckableType, RuntimeType } from './common.js';
import { ArrayType, IntersectionType, LiteralType, ObjectType, RecordType, RecursiveType, TupleType, TypeofType, UnionType, UnknownType, type ObjectPropertyType } from './types.js';

const optionalSymbol = Symbol();

type OptionalPropertyType<T> = readonly [typeof optionalSymbol, RuntimeType<T>];

type PropertyTypeDefinition =
    | TypeDefinition
    | OptionalPropertyType<unknown>;

function isOptionalPropertyType(type: PropertyTypeDefinition): type is OptionalPropertyType<unknown> {
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
    & { -readonly [P in keyof T as T[P] extends OptionalPropertyType<any> ? never : P]: TypeFromDefinition<T[P]>; }
    & { -readonly [P in keyof T as T[P] extends OptionalPropertyType<any> ? P : never]?: T[P] extends OptionalPropertyType<infer U> ? U : never; };

export type TypeFromDefinition<T> =
    T extends CheckableType<infer U> ? U :
    T extends RuntimeType<infer U> ? U :
    T extends string | number | boolean | null | undefined ? T :
    T extends typeof String ? string :
    T extends typeof Number ? number :
    T extends typeof Boolean ? boolean :
    T extends typeof BigInt ? bigint :
    T extends readonly unknown[] ? { -readonly [P in keyof T]: TypeFromDefinition<T[P]>; } :
    T extends Readonly<AnyRecord> ? ObjectTypeFromDefinition<T> :
    never;

type UnionTypeFromTupleDefinition<T extends unknown[]> = SimplifyObjectType<{
    [P in Exclude<keyof T, keyof []>]: TypeFromDefinition<T[P]>;
}>[Exclude<keyof T, keyof []>];

type IntersectionTypeFromTupleDefinition<T extends unknown[]> = UnionToIntersection<UnionTypeFromTupleDefinition<T>>;

type PartialTypeFromObjectDefinition<T extends AnyRecord> = Partial<ObjectTypeFromDefinition<T>>;

interface PlainObjectOptions<P extends boolean | undefined> {
    noExcessProperties?: boolean | undefined;
    partial?: P;
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

    const stringType = new TypeofType('string');

    function fromDefinition(typeDefinition: TypeDefinition): RuntimeType<unknown> {
        const type = typeof typeDefinition;
        if (typeDefinition === null || typeDefinition === undefined || type === 'string' || type === 'number' || type === 'boolean' || type === 'bigint')
            return new LiteralType(typeDefinition);
        if (typeDefinition === String)
            return stringType;
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
        if (CheckableType.test(typeDefinition))
            return new UnknownType(typeDefinition);
        if (isArray(typeDefinition))
            return new TupleType(typeDefinition.map(fromDefinition));
        return new ObjectType(getObjectPropertiesInfo(typeDefinition, false), false);
    }

    export function from<T extends TypeDefinition>(typeDefinition: T) {
        return fromDefinition(typeDefinition) as RuntimeType<TypeFromDefinition<T>>;
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

    export function object<T extends Record<string, PropertyTypeDefinition>>(options: PlainObjectOptions<false | undefined>, typeDefinition: T): RuntimeType<ObjectTypeFromDefinition<T>>;
    export function object<T extends Record<string, PropertyTypeDefinition>>(options: PlainObjectOptions<true>, typeDefinition: T): RuntimeType<PartialTypeFromObjectDefinition<T>>;
    export function object<T extends Record<string, PropertyTypeDefinition>>(options: PlainObjectOptions<boolean | undefined>, typeDefinition: T) {
        return new ObjectType(getObjectPropertiesInfo(typeDefinition, options.partial ?? false), options.noExcessProperties ?? false);
    }

    export function partial<T extends Record<string, PropertyTypeDefinition>>(typeDefinition: T): RuntimeType<PartialTypeFromObjectDefinition<T>> {
        return new ObjectType(getObjectPropertiesInfo(typeDefinition, true), false);
    }

    export function optional<T extends TypeDefinition>(typeDefinition: T, allowUndefined?: false): OptionalPropertyType<TypeFromDefinition<T>>;
    export function optional<T extends TypeDefinition>(typeDefinition: T, allowUndefined: true): OptionalPropertyType<TypeFromDefinition<T> | undefined>;
    export function optional<T extends TypeDefinition>(typeDefinition: T, allowUndefined = false) {
        return [
            optionalSymbol,
            allowUndefined ? union(typeDefinition, literalUndefined) : fromDefinition(typeDefinition)
        ] as const;
    }

    export function record<T extends TypeDefinition>(typeDefinition: T): RuntimeType<Record<string, TypeFromDefinition<T>>>;
    export function record<K extends StringTypeDefinition, V extends TypeDefinition>(keyTypeDefinition: K, valueTypeDefinition: V): RuntimeType<Record<TypeFromDefinition<K>, TypeFromDefinition<V>>>;
    export function record(typeDefinition1: TypeDefinition, typeDefinition2?: TypeDefinition) {
        const keyType = typeDefinition2 === undefined ? stringType : fromDefinition(typeDefinition1) as RuntimeType<string>;
        const valueType = fromDefinition(typeDefinition2 === undefined ? typeDefinition1 : typeDefinition2);
        return new RecordType(keyType, valueType);
    }

    const uncheckedType: CheckableType<unknown> = {
        [CheckableType.check]() {
            return { success: true, errors: [] };
        }
    };

    export function unchecked<T>() {
        return new UnknownType(uncheckedType as CheckableType<T>);
    }

    export const unknown = unchecked<unknown>();

    export function recursive<T>(create: (type: RuntimeType<T>) => RuntimeType<T>) {
        const { type, resolve } = RecursiveType.create<T>();
        resolve(create(type));
        return type;
    }
}
