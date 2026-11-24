import { Schema } from "effect";
import type { I18n } from "../../i18n/I18n.service";
import { FilmListItemViewModel } from "./FilmListItem.model";

export const FilmListItemInput = Schema.Struct({
  title: Schema.NonEmptyString,
  episodeId: Schema.Int,
});
export type FilmListItemInput = typeof FilmListItemInput.Type;

export const makeFilmListItemViewModel = (
  i18n: I18n,
  film: FilmListItemInput,
): FilmListItemViewModel =>
  FilmListItemViewModel.make({
    text: i18n._({
      id: "film.listItem",
      values: {
        title: film.title,
        episodeLabel: i18n._({ id: "film.episodeLabel" }),
        episodeId: film.episodeId,
      },
    }),
  });
