import type { FilmListViewModel } from "./FilmList.model";

export type FilmListProps = {
  readonly model: FilmListViewModel;
};

export const FilmList = ({ model }: FilmListProps) => (
  <section>
    <h2>{model.countLabel}</h2>
    <ul>
      {model.films.map((film) => (
        <li key={`${film.episodeId}-${film.title}`}>
          {film.title} ({model.episodeLabel} {film.episodeId})
        </li>
      ))}
    </ul>
  </section>
);
