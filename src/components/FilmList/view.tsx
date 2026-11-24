import type { FilmListViewModel } from "./model";

export type FilmListProps = {
  readonly films: FilmListViewModel;
};

export const FilmList = ({ films }: FilmListProps) => (
  <ul>
    {films.map((film) => (
      <li key={`${film.episodeId}-${film.title}`}>
        {film.title} (Episode {film.episodeId})
      </li>
    ))}
  </ul>
);
