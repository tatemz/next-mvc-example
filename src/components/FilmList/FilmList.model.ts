import { Schema } from "effect";

export const FilmViewModel = Schema.TaggedStruct("FilmViewModel", {
  title: Schema.NonEmptyString,
  episodeId: Schema.Int,
});
export type FilmViewModel = typeof FilmViewModel.Type;

export const FilmListViewModel = Schema.TaggedStruct("FilmListViewModel", {
  films: Schema.NonEmptyArray(FilmViewModel),
  episodeLabel: Schema.NonEmptyString,
  countLabel: Schema.NonEmptyString,
});
export type FilmListViewModel = typeof FilmListViewModel.Type;
