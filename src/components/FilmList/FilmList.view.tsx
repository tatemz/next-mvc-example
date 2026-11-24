import { Array } from "effect";
import { FilmListItem } from "../FilmListItem/FilmListItem.view";
import type { FilmListViewModel } from "./FilmList.model";

export type FilmListProps = {
  readonly model: FilmListViewModel;
};

export const FilmList = ({ model }: FilmListProps) => (
  <section>
    <h2>{model.countLabel}</h2>
    <ul>
      {Array.map(model.films, (film) => (
        <FilmListItem key={film.text} model={film} />
      ))}
    </ul>
  </section>
);
