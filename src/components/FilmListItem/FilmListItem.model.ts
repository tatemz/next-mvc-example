import { Schema } from "effect";

export const FilmListItemViewModel = Schema.TaggedStruct(
  "FilmListItemViewModel",
  {
    text: Schema.NonEmptyString,
  },
);
export type FilmListItemViewModel = typeof FilmListItemViewModel.Type;
