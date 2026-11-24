import { Schema } from "effect";
import { CharacterId } from "./CharacterId.model";
import { Film } from "./Film.model";

export const Person = Schema.TaggedStruct("Person", {
  id: CharacterId,
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
  films: Schema.NonEmptyArray(Film),
});
export type Person = typeof Person.Type;
