import { Schema, SchemaGetter } from "effect";

const CharacterNumber = Schema.NumberFromString.check(
  Schema.isInt(),
  Schema.isGreaterThan(0),
);

export const CharacterId = CharacterNumber.pipe(
  Schema.decodeTo(Schema.String, {
    decode: SchemaGetter.transform((value: number) => String(value)),
    encode: SchemaGetter.transform((value: string) => Number(value)),
  }),
  Schema.brand("CharacterId"),
);
export type CharacterId = typeof CharacterId.Type;
