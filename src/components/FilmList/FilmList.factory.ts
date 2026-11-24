import { FilmListViewModel, FilmViewModel } from "./FilmList.model";

export type FilmListItem = {
  readonly title: string;
  readonly episodeId: number;
};

const formatFilmCount = (count: number): string =>
  count === 1 ? "1 film" : `${count} films`;

export const makeFilmListViewModel = (
  films: readonly [FilmListItem, ...Array<FilmListItem>],
): FilmListViewModel => {
  const [first, ...rest] = films;
  return FilmListViewModel.make({
    episodeLabel: "Episode",
    countLabel: formatFilmCount(films.length),
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
