import { Schema } from "effect";

export const FilmListItemViewModel = Schema.TaggedStruct(
  "FilmListItemViewModel",
  {
    order: Schema.Int,
    text: Schema.NonEmptyString,
  },
);
export type FilmListItemViewModel = typeof FilmListItemViewModel.Type;

export const FilmListItemInput = Schema.Struct({
  title: Schema.NonEmptyString,
  order: Schema.Int,
});
export type FilmListItemInput = typeof FilmListItemInput.Type;

export const makeFilmListItemViewModel = (film: FilmListItemInput) =>
  FilmListItemViewModel.make({
    order: film.order,
    text: film.title,
  });

export type FilmListItemProps = FilmListItemViewModel;

export const FilmListItem = (model: FilmListItemProps) => (
  <li className="py-2">{model.text}</li>
);
