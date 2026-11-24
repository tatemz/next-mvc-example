import { Array, Function, Schema } from "effect";
import type { I18n } from "../../i18n/I18n.service";
import { FilmListItem, FilmListItemViewModel } from "../FilmListItem/FilmListItem";

export const FilmListViewModel = Schema.TaggedStruct("FilmListViewModel", {
  films: Schema.NonEmptyArray(FilmListItemViewModel),
  countLabel: Schema.NonEmptyString,
});
export type FilmListViewModel = typeof FilmListViewModel.Type;

export const makeFilmListViewModel = (
  i18n: I18n,
  films: readonly [
    FilmListItemViewModel,
    ...FilmListItemViewModel[],
  ],
) =>
  FilmListViewModel.make({
    countLabel: i18n._({
      id: "film.count",
      values: { count: films.length },
    }),
    films,
  });

export type FilmListProps = FilmListViewModel;

export const FilmList = (model: FilmListProps) => (
  <section className="card bg-base-100 shadow-xl">
    <div className="card-body gap-3">
      <h2 className="card-title">{model.countLabel}</h2>
      <ul className="divide-y divide-base-300">
        {Function.pipe(
          model.films,
          Array.map((film) => (
            <FilmListItem key={film.episodeId} {...film} />
          )),
        )}
      </ul>
    </div>
  </section>
);
