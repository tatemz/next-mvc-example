import type { FilmListViewModel } from "../../components/FilmList/FilmList.model";
import type { PersonViewModel } from "../../components/PersonCard/PersonCard.model";
import { makeSearchFormViewModel } from "../../components/SearchForm/SearchForm.factory";
import { HomePageViewModel } from "./HomePage.model";

export type LoadedHomePageInput = {
  readonly characterId: string;
  readonly person: PersonViewModel;
  readonly filmList: FilmListViewModel;
};

export const makeLoadedHomePageModel = (
  input: LoadedHomePageInput,
): HomePageViewModel =>
  HomePageViewModel.cases.Loaded.make({
    form: makeSearchFormViewModel(input.characterId),
    person: input.person,
    filmList: input.filmList,
  });

export const makeFailedHomePageModel = (options: {
  readonly characterId: string;
  readonly message: string;
}): HomePageViewModel =>
  HomePageViewModel.cases.Failed.make({
    form: makeSearchFormViewModel(options.characterId),
    message: options.message,
  });
