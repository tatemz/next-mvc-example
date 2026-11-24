import { Prism } from "@fuiste/optics";
import { Schema } from "effect";
import type { I18n } from "../../i18n/I18n.service";
import { FilmList, FilmListViewModel } from "../FilmList/FilmList";
import { PersonCard, PersonViewModel } from "../PersonCard/PersonCard";
import {
  makeInitialSearchFormViewModel,
  makeRetrySearchFormViewModel,
  SearchForm,
  SearchFormOptics,
  SearchFormViewModel,
} from "../SearchForm/SearchForm";

export const HomePageViewModel = Schema.TaggedUnion({
  Loaded: {
    form: SearchFormViewModel,
    person: PersonViewModel,
    filmList: FilmListViewModel,
  },
  Failed: {
    form: SearchFormViewModel,
    message: Schema.NonEmptyString,
  },
});
export type HomePageViewModel = typeof HomePageViewModel.Type;

const FormPrism = Prism<HomePageViewModel>().of({
  get: (model) => model.form,
  set: (form) => (model) => ({ ...model, form }),
});

export const HomePageOptics = {
  FormValue: Prism<HomePageViewModel>().compose(
    FormPrism,
    SearchFormOptics.Value,
  ),
  FormError: Prism<HomePageViewModel>().compose(
    FormPrism,
    SearchFormOptics.Error,
  ),
};

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
) =>
  HomePageViewModel.cases.Loaded.make({
    form: makeInitialSearchFormViewModel(i18n, input.formValue),
    person: input.person,
    filmList: input.filmList,
  });

export const makeFailedHomePageModel = (
  i18n: I18n,
  input: FailedHomePageInput,
) =>
  HomePageViewModel.cases.Failed.make({
    form: makeRetrySearchFormViewModel(i18n, input.formValue),
    message: i18n._({ id: "homePage.loadError" }),
  });

type HomePageExtras = {
  readonly dispatch: (formData: FormData) => void;
  readonly isPending: boolean;
};

export type HomePageProps = HomePageViewModel & HomePageExtras;

type LoadedHomePageViewModel = Extract<
  HomePageViewModel,
  { readonly _tag: "Loaded" }
>;

type FailedHomePageViewModel = Extract<
  HomePageViewModel,
  { readonly _tag: "Failed" }
>;

type LoadedHomePageProps = LoadedHomePageViewModel & HomePageExtras;

type FailedHomePageProps = FailedHomePageViewModel & HomePageExtras;

const LoadedHomePage = ({
  dispatch,
  isPending,
  ...model
}: LoadedHomePageProps) => (
  <>
    <PersonCard {...model.person} />
    <FilmList {...model.filmList} />
    <SearchForm
      {...model.form}
      dispatch={dispatch}
      isPending={isPending}
    />
  </>
);

const FailedHomePage = ({
  dispatch,
  isPending,
  ...model
}: FailedHomePageProps) => (
  <>
    <p role="alert">{model.message}</p>
    <SearchForm
      {...model.form}
      dispatch={dispatch}
      isPending={isPending}
    />
  </>
);

export const HomePage = ({
  dispatch,
  isPending,
  ...model
}: HomePageProps) =>
  HomePageViewModel.match(model, {
    Loaded: (loaded) => (
      <LoadedHomePage
        {...loaded}
        dispatch={dispatch}
        isPending={isPending}
      />
    ),
    Failed: (failed) => (
      <FailedHomePage
        {...failed}
        dispatch={dispatch}
        isPending={isPending}
      />
    ),
  });
