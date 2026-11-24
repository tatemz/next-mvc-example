import type { Film } from "../../domain/Film.model";
import type { Person } from "../../domain/Person.model";
import {
  type FilmListItem,
  makeFilmListViewModel,
} from "../../components/FilmList/FilmList.factory";
import { makePersonViewModel } from "../../components/PersonCard/PersonCard.factory";
import { makeLoadedHomePageModel } from "./HomePage.factory";
import type { HomePageViewModel } from "./HomePage.model";

const filmListItem = (film: Film): FilmListItem => ({
  title: film.title,
  episodeId: film.episodeId,
});

export const presentLoadedHomePage = (person: Person): HomePageViewModel => {
  const [firstFilm, ...restFilms] = person.films;
  return makeLoadedHomePageModel({
    characterId: person.id,
    person: makePersonViewModel({
      name: person.name,
      height: person.height,
      mass: person.mass,
    }),
    filmList: makeFilmListViewModel([
      filmListItem(firstFilm),
      ...restFilms.map(filmListItem),
    ]),
  });
};
