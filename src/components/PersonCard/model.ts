import { Schema } from "effect";

export const PersonViewModel = Schema.Struct({
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
});
export type PersonViewModel = typeof PersonViewModel.Type;
