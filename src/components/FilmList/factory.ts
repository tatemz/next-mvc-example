import type { Film } from "../../domain/Person";
import { FilmListViewModel, FilmViewModel } from "./model";

export const makeFilmListViewModel = (
  films: readonly [Film, ...Array<Film>],
): FilmListViewModel => {
  const [first, ...rest] = films;
  return FilmListViewModel.make({
    films: [
      FilmViewModel.make({
        title: first.title,
        episodeId: first.episodeId,
      }),
      ...rest.map((film) =>
        FilmViewModel.make({
          title: film.title,
          episodeId: film.episodeId,
        }),
      ),
    ],
  });
};
