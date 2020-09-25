import { AnyRecord, ArgumentError, isArray } from '@nw55/common';
import { CheckableType, TypeDefinition, TypeFromDefinition } from './common';
import { ArrayType, TupleType } from './internal/array-types';
import { LiteralType, TypeofType } from './internal/basic-types';
import { PlainObjectProperty, PlainObjectType, RecordType } from './internal/object-types';
import { OptionalType, UnionType } from './internal/special-types';

type UnionTypeFromTupleDefinition<T extends unknown[]> = {
    [P in keyof T]: TypeFromDefinition<T[P]>;
}[Exclude<keyof T, keyof []>];

type PartialTypeFromObjectDefinition<T extends AnyRecord> = {
    [P in keyof T]?: TypeFromDefinition<T[P]>;
};

interface PlainObjectOptions {
    noExcessProperties?: boolean;
    partial?: boolean;
}

export namespace Type {
    export type Of<T> = T extends CheckableType ? CheckableType.ExtractType<T> : never;

    export const literalUndefined = new LiteralType<undefined>(undefined);
    export const literalNull = new LiteralType<null>(null);
    export const literalTrue = new LiteralType<true>(true);
    export const literalFalse = new LiteralType<false>(false);

    function getObjectPropertiesInfo(typeDefinition: Readonly<AnyRecord>, required: boolean) {
        return Object.entries(typeDefinition).map<PlainObjectProperty>(([key, value]) => ({
            key,
            type: fromDefinition(value as any),
            required
        }));
    }

    function fromDefinition(typeDefinition: TypeDefinition): CheckableType {
        const type = typeof typeDefinition;
        if (typeDefinition === null || typeDefinition === undefined || type === 'string' || type === 'number' || type === 'boolean')
            return new LiteralType(typeDefinition);
        if (typeDefinition === String)
            return new TypeofType('string');
        if (typeDefinition === Number)
            return new TypeofType('number');
        if (typeDefinition === Boolean)
            return new TypeofType('boolean');
        if (typeof typeDefinition !== 'object')
            throw new ArgumentError();
        if (CheckableType.test(typeDefinition))
            return typeDefinition;
        if (isArray(typeDefinition))
            return new TupleType(typeDefinition.map(fromDefinition));
        return new PlainObjectType(getObjectPropertiesInfo(typeDefinition, true), false);
    }

    export function from<T extends TypeDefinition>(typeDefinition: T): CheckableType<TypeFromDefinition<T>> {
        return fromDefinition(typeDefinition);
    }

    export function union<T extends TypeDefinition[]>(...typeDefinitions: T): CheckableType<UnionTypeFromTupleDefinition<T>> {
        return new UnionType(typeDefinitions.map(fromDefinition));
    }

    export function array<T extends TypeDefinition>(typeDefinition: T): CheckableType<TypeFromDefinition<T>[]> {
        return new ArrayType(fromDefinition(typeDefinition));
    }

    export function plainObject<T extends Record<string, TypeDefinition>>(options: PlainObjectOptions, typeDefinition: T): CheckableType<PartialTypeFromObjectDefinition<T>> {
        return new PlainObjectType(getObjectPropertiesInfo(typeDefinition, !(options.partial ?? false)), options.noExcessProperties ?? false);
    }

    export function partial<T extends Record<string, TypeDefinition>>(typeDefinition: T): CheckableType<PartialTypeFromObjectDefinition<T>> {
        return plainObject({ partial: true }, typeDefinition);
    }

    // behaves like a union with undefined but is specially handled when used in plain objects
    export function optional<T extends TypeDefinition>(typeDefinition: T): CheckableType<TypeFromDefinition<T> | undefined> {
        return new OptionalType(fromDefinition(typeDefinition));
    }

    export function record<T extends TypeDefinition>(typeDefinition: T): CheckableType<Record<PropertyKey, TypeFromDefinition<T>>> {
        return new RecordType(fromDefinition(typeDefinition));
    }

    const uncheckedType: CheckableType = {
        [CheckableType.check]() {
            return { success: true, errors: [] };
        }
    };

    export function unchecked<T>(): CheckableType<T> {
        return uncheckedType;
    }

    export const unknown = unchecked<unknown>();
}
