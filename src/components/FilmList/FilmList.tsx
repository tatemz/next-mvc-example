import { Array, Function, Schema } from "effect";
import type { I18n } from "../../i18n/I18n.service";
import {
  FilmListItem,
  type FilmListItemInput,
  FilmListItemViewModel,
  makeFilmListItemViewModel,
} from "../FilmListItem/FilmListItem";

export const FilmListViewModel = Schema.TaggedStruct("FilmListViewModel", {
  films: Schema.NonEmptyArray(FilmListItemViewModel),
  countLabel: Schema.NonEmptyString,
});
export type FilmListViewModel = typeof FilmListViewModel.Type;

export const makeFilmListViewModel = (
  i18n: I18n,
  films: readonly [FilmListItemInput, ...Array<FilmListItemInput>],
) =>
  FilmListViewModel.make({
    countLabel: i18n._({
      id: "film.count",
      values: { count: films.length },
    }),
    films: Function.pipe(
      films,
      Array.map((film) => makeFilmListItemViewModel(i18n, film)),
    ),
  });

export type FilmListProps = FilmListViewModel;

export const FilmList = (model: FilmListProps) => (
  <section>
    <h2>{model.countLabel}</h2>
    <ul>
      {Function.pipe(
        model.films,
        Array.map((film) => (
          <FilmListItem key={film.text} {...film} />
        )),
      )}
    </ul>
  </section>
);
