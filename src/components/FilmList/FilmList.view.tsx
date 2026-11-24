import { Array, Function } from "effect";
import { FilmListItem } from "../FilmListItem/FilmListItem.view";
import type { FilmListViewModel } from "./FilmList.model";

export type FilmListProps = FilmListViewModel;

export const FilmList = ({ countLabel, films }: FilmListProps) => (
  <section>
    <h2>{countLabel}</h2>
    <ul>
      {Function.pipe(
        films,
        Array.map((film) => (
          <FilmListItem key={film.text} {...film} />
        )),
      )}
    </ul>
  </section>
);
