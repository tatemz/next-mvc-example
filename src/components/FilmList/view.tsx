import type { FilmListViewModel } from "./model";

export type FilmListProps = {
  readonly model: FilmListViewModel;
};

export const FilmList = ({ model }: FilmListProps) => (
  <ul>
    {model.films.map((film) => (
      <li key={`${film.episodeId}-${film.title}`}>
        {film.title} (Episode {film.episodeId})
      </li>
    ))}
  </ul>
);
