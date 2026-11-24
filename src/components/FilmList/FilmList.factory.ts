import { Array, Match } from "effect";
import {
  type FilmListItemInput,
  makeFilmListItemViewModel,
} from "../FilmListItem/FilmListItem.factory";
import { FilmListViewModel } from "./FilmList.model";

const formatFilmCount = (count: number): string =>
  Match.value(count).pipe(
    Match.when(1, () => "1 film"),
    Match.orElse((count) => `${count} films`),
  );

export const makeFilmListViewModel = (
  films: readonly [FilmListItemInput, ...Array<FilmListItemInput>],
): FilmListViewModel =>
  FilmListViewModel.make({
    countLabel: formatFilmCount(films.length),
    films: Array.map(films, makeFilmListItemViewModel),
  });
