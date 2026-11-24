import type { Person } from "../../domain/Person";
import { makeFilmListViewModel } from "../FilmList/factory";
import { PersonViewModel } from "../PersonCard/model";
import { SearchFormViewModel } from "../SearchForm/model";
import { HomePageViewModel } from "./model";

export const makeLoadedHomePageModel = (person: Person): HomePageViewModel =>
  HomePageViewModel.cases.Loaded.make({
    form: SearchFormViewModel.make({
      characterId: String(person.id),
    }),
    person: PersonViewModel.make({
      name: person.name,
      height: person.height,
      mass: person.mass,
    }),
    filmList: makeFilmListViewModel(person.films),
  });

export const makeFailedHomePageModel = (options: {
  readonly characterId: string;
  readonly message: string;
}): HomePageViewModel =>
  HomePageViewModel.cases.Failed.make({
    form: SearchFormViewModel.make({
      characterId: options.characterId,
    }),
    message: options.message,
  });
