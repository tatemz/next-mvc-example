import { Schema } from "effect";
import { FilmListItemViewModel } from "./FilmListItem.model";

export const FilmListItemInput = Schema.Struct({
  title: Schema.NonEmptyString,
  episodeId: Schema.Int,
});
export type FilmListItemInput = typeof FilmListItemInput.Type;

export const makeFilmListItemViewModel = (
  film: FilmListItemInput,
): FilmListItemViewModel =>
  FilmListItemViewModel.make({
    text: `${film.title} (Episode ${film.episodeId})`,
  });
