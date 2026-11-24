import { Array } from "effect";
import type { I18n } from "../../i18n/I18n.service";
import {
  type FilmListItemInput,
  makeFilmListItemViewModel,
} from "../FilmListItem/FilmListItem.factory";
import { FilmListViewModel } from "./FilmList.model";

export const makeFilmListViewModel = (
  i18n: I18n,
  films: readonly [FilmListItemInput, ...Array<FilmListItemInput>],
) =>
  FilmListViewModel.make({
    countLabel: i18n._({
      id: "film.count",
      values: { count: films.length },
    }),
    films: Array.map(films, (film) => makeFilmListItemViewModel(i18n, film)),
  });
