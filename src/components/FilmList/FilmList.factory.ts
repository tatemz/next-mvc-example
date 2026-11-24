import { FilmListViewModel, FilmViewModel } from "./FilmList.model";

export type FilmListItem = {
  readonly title: string;
  readonly episodeId: number;
};

export const makeFilmListViewModel = (
  films: readonly [FilmListItem, ...Array<FilmListItem>],
): FilmListViewModel => {
  const [first, ...rest] = films;
  return FilmListViewModel.make({
    episodeLabel: "Episode",
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
