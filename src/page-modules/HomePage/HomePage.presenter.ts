import { Array } from "effect";
import type { Film } from "../../domain/Film.model";
import type { Person } from "../../domain/Person.model";
import { makeFilmListViewModel } from "../../components/FilmList/FilmList.factory";
import type { FilmListItemInput } from "../../components/FilmListItem/FilmListItem.factory";
import { makePersonViewModel } from "../../components/PersonCard/PersonCard.factory";
import { makeLoadedHomePageModel } from "./HomePage.factory";
import type { HomePageViewModel } from "./HomePage.model";

const filmListItem = (film: Film): FilmListItemInput => ({
  title: film.title,
  episodeId: film.episodeId,
});

export const presentLoadedHomePage = (person: Person): HomePageViewModel =>
  makeLoadedHomePageModel({
    characterId: person.id,
    person: makePersonViewModel({
      name: person.name,
      height: person.height,
      mass: person.mass,
    }),
    filmList: makeFilmListViewModel(Array.map(person.films, filmListItem)),
  });
