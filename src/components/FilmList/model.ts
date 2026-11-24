import { Schema } from "effect";

export const FilmViewModel = Schema.Struct({
  title: Schema.NonEmptyString,
  episodeId: Schema.Int,
});
export type FilmViewModel = typeof FilmViewModel.Type;

export const FilmListViewModel = Schema.NonEmptyArray(FilmViewModel);
export type FilmListViewModel = typeof FilmListViewModel.Type;
