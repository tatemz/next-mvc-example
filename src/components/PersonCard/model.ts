import { Schema } from "effect";

export const PersonViewModel = Schema.TaggedStruct("PersonViewModel", {
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
});
export type PersonViewModel = typeof PersonViewModel.Type;
