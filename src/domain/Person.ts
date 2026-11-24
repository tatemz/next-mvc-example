import { Schema } from "effect";

export const Film = Schema.TaggedStruct("Film", {
  title: Schema.NonEmptyString,
  episodeId: Schema.Int,
});
export type Film = typeof Film.Type;

export const Person = Schema.TaggedStruct("Person", {
  id: Schema.Int,
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
  films: Schema.NonEmptyArray(Film),
});
export type Person = typeof Person.Type;
