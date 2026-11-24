import { Array } from "effect";
import { FilmListItem } from "../FilmListItem/FilmListItem.view";
import type { FilmListViewModel } from "./FilmList.model";

export type FilmListProps = FilmListViewModel;

export const FilmList = ({ countLabel, films }: FilmListProps) => (
  <section>
    <h2>{countLabel}</h2>
    <ul>
      {Array.map(films, (film) => (
        <FilmListItem key={film.text} {...film} />
      ))}
    </ul>
  </section>
);
