import { Schema } from "effect";

export const Film = Schema.TaggedStruct("Film", {
  title: Schema.NonEmptyString,
  episodeId: Schema.Int,
});
export type Film = typeof Film.Type;
