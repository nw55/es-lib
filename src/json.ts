/* eslint-disable @typescript-eslint/consistent-type-definitions */

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type JsonObject = { [property: string]: JsonValue; };
export type JsonArray = JsonValue[];

export type PartialJsonValue = string | number | boolean | null | PartialJsonObject | PartialJsonArray;
export type PartialJsonObject = { [property: string]: PartialJsonValue | undefined; };
export type PartialJsonArray = PartialJsonValue[];

export type ReadonlyJsonValue = string | number | boolean | null | ReadonlyJsonObject | ReadonlyJsonArray;
export type ReadonlyJsonObject = { readonly [property: string]: ReadonlyJsonValue; };
export type ReadonlyJsonArray = readonly ReadonlyJsonValue[];

export type PartialReadonlyJsonValue = string | number | boolean | null | PartialReadonlyJsonObject | PartialReadonlyJsonArray;
export type PartialReadonlyJsonObject = { readonly [property: string]: PartialReadonlyJsonValue | undefined; };
export type PartialReadonlyJsonArray = readonly PartialReadonlyJsonValue[];

export function parseJsonString(str: string): PartialJsonValue {
    return JSON.parse(str);
}

export function toJsonString(value: ReadonlyJsonValue, space?: number) {
    return JSON.stringify(value, null, space);
}
