import { Function, Schema, SchemaGetter } from "effect";

const CharacterNumber = Schema.NumberFromString.check(
  Schema.isInt(),
  Schema.isGreaterThan(0),
);

export const CharacterId = Function.pipe(
  CharacterNumber,
  Schema.decodeTo(Schema.String, {
    decode: SchemaGetter.transform((value: number) => String(value)),
    encode: SchemaGetter.transform((value: string) => Number(value)),
  }),
  Schema.brand("CharacterId"),
);
export type CharacterId = typeof CharacterId.Type;

export const Film = Schema.TaggedStruct("Film", {
  title: Schema.NonEmptyString,
  order: Schema.Int,
  imageUrl: Schema.optional(Schema.String),
});
export type Film = typeof Film.Type;

export const Origin = Schema.TaggedStruct("Origin", {
  name: Schema.NonEmptyString,
  climate: Schema.String,
  terrain: Schema.String,
});
export type Origin = typeof Origin.Type;

export const Species = Schema.TaggedStruct("Species", {
  name: Schema.NonEmptyString,
  classification: Schema.String,
  language: Schema.String,
});
export type Species = typeof Species.Type;

export const TransportKind = Schema.Literals(["Starship", "Vehicle"]);
export type TransportKind = typeof TransportKind.Type;

export const Transport = Schema.TaggedStruct("Transport", {
  key: Schema.NonEmptyString,
  kind: TransportKind,
  name: Schema.NonEmptyString,
  model: Schema.NonEmptyString,
});
export type Transport = typeof Transport.Type;

export const PersonSummary = Schema.TaggedStruct("PersonSummary", {
  id: CharacterId,
  name: Schema.NonEmptyString,
});
export type PersonSummary = typeof PersonSummary.Type;

export const Person = Schema.TaggedStruct("Person", {
  id: CharacterId,
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
  birthYear: Schema.String,
  gender: Schema.String,
  origin: Origin,
  species: Schema.NullOr(Species),
  films: Schema.NonEmptyArray(Film),
  transports: Schema.Array(Transport),
});
export type Person = typeof Person.Type;
