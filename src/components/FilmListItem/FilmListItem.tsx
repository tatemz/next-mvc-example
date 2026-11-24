import { Schema } from "effect";
import type { I18n } from "../../i18n/I18n.service";

export const FilmListItemViewModel = Schema.TaggedStruct(
  "FilmListItemViewModel",
  {
    episodeId: Schema.Int,
    text: Schema.NonEmptyString,
  },
);
export type FilmListItemViewModel = typeof FilmListItemViewModel.Type;

export const FilmListItemInput = Schema.Struct({
  title: Schema.NonEmptyString,
  episodeId: Schema.Int,
});
export type FilmListItemInput = typeof FilmListItemInput.Type;

export const makeFilmListItemViewModel = (
  i18n: I18n,
  film: FilmListItemInput,
) =>
  FilmListItemViewModel.make({
    episodeId: film.episodeId,
    text: i18n._({
      id: "film.listItem",
      values: {
        title: film.title,
        episodeLabel: i18n._({ id: "film.episodeLabel" }),
        episodeId: film.episodeId,
      },
    }),
  });

export type FilmListItemProps = FilmListItemViewModel;

export const FilmListItem = (model: FilmListItemProps) => (
  <li className="py-2">{model.text}</li>
);
