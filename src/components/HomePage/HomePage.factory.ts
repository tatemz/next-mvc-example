import { Schema } from "effect";
import { FilmListViewModel } from "../FilmList/FilmList.model";
import { PersonViewModel } from "../PersonCard/PersonCard.model";
import { SearchFormViewModel } from "../SearchForm/SearchForm.model";
import { HomePageViewModel } from "./HomePage.model";

export const LoadedHomePageInput = Schema.Struct({
  form: SearchFormViewModel,
  person: PersonViewModel,
  filmList: FilmListViewModel,
});
export type LoadedHomePageInput = typeof LoadedHomePageInput.Type;

export const FailedHomePageInput = Schema.Struct({
  form: SearchFormViewModel,
  message: Schema.NonEmptyString,
});
export type FailedHomePageInput = typeof FailedHomePageInput.Type;

export const makeLoadedHomePageModel = (
  input: LoadedHomePageInput,
): HomePageViewModel =>
  HomePageViewModel.cases.Loaded.make({
    form: input.form,
    person: input.person,
    filmList: input.filmList,
  });

export const makeFailedHomePageModel = (
  input: FailedHomePageInput,
): HomePageViewModel =>
  HomePageViewModel.cases.Failed.make({
    form: input.form,
    message: input.message,
  });
