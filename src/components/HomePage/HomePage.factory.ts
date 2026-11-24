import { Schema } from "effect";
import type { I18n } from "../../i18n/I18n.service";
import { FilmListViewModel } from "../FilmList/FilmList.model";
import { PersonViewModel } from "../PersonCard/PersonCard.model";
import {
  makeInitialSearchFormViewModel,
  makeRetrySearchFormViewModel,
} from "../SearchForm/SearchForm.factory";
import { HomePageViewModel } from "./HomePage.model";

export const LoadedHomePageInput = Schema.Struct({
  formValue: Schema.String,
  person: PersonViewModel,
  filmList: FilmListViewModel,
});
export type LoadedHomePageInput = typeof LoadedHomePageInput.Type;

export const FailedHomePageInput = Schema.Struct({
  formValue: Schema.String,
});
export type FailedHomePageInput = typeof FailedHomePageInput.Type;

export const makeLoadedHomePageModel = (
  i18n: I18n,
  input: LoadedHomePageInput,
): HomePageViewModel =>
  HomePageViewModel.cases.Loaded.make({
    form: makeInitialSearchFormViewModel(i18n, input.formValue),
    person: input.person,
    filmList: input.filmList,
  });

export const makeFailedHomePageModel = (
  i18n: I18n,
  input: FailedHomePageInput,
): HomePageViewModel =>
  HomePageViewModel.cases.Failed.make({
    form: makeRetrySearchFormViewModel(i18n, input.formValue),
    message: i18n._({ id: "homePage.loadError" }),
  });
