import { Schema } from "effect";
import { FilmListViewModel } from "../../components/FilmList/FilmList.model";
import { PersonViewModel } from "../../components/PersonCard/PersonCard.model";
import {
  makeInitialSearchFormViewModel,
  makeRetrySearchFormViewModel,
} from "../../components/SearchForm/SearchForm.factory";
import { HomePageViewModel } from "./HomePage.model";

export const LoadedHomePageInput = Schema.Struct({
  characterId: Schema.String,
  person: PersonViewModel,
  filmList: FilmListViewModel,
});
export type LoadedHomePageInput = typeof LoadedHomePageInput.Type;

export const FailedHomePageInput = Schema.Struct({
  characterId: Schema.String,
  message: Schema.NonEmptyString,
});
export type FailedHomePageInput = typeof FailedHomePageInput.Type;

export const makeLoadedHomePageModel = (
  input: LoadedHomePageInput,
): HomePageViewModel =>
  HomePageViewModel.cases.Loaded.make({
    form: makeInitialSearchFormViewModel(input.characterId),
    person: input.person,
    filmList: input.filmList,
  });

export const makeFailedHomePageModel = (
  input: FailedHomePageInput,
): HomePageViewModel =>
  HomePageViewModel.cases.Failed.make({
    form: makeRetrySearchFormViewModel(input.characterId),
    message: input.message,
  });
