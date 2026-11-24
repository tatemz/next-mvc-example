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

export const Film = Schema.TaggedStruct("Film", {
  title: Schema.NonEmptyString,
  episodeId: Schema.Int,
});
export type Film = typeof Film.Type;

export const Person = Schema.TaggedStruct("Person", {
  id: CharacterId,
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
  films: Schema.NonEmptyArray(Film),
});
export type Person = typeof Person.Type;
