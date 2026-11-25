import { Prism } from "@fuiste/optics";
import { Schema } from "effect";
import type { I18n } from "../i18n/I18n.service";
import { AppShell, AppShellViewModel } from "./AppShell";
import { FilmList, FilmListViewModel } from "./FilmList";
import { PersonCard, PersonViewModel } from "./PersonCard";
import {
  makeInitialSearchFormViewModel,
  makeRetrySearchFormViewModel,
  SearchForm,
  SearchFormOptics,
  SearchFormViewModel,
} from "./SearchForm";

export const HomeHeroViewModel = Schema.TaggedStruct("HomeHeroViewModel", {
  title: Schema.NonEmptyString,
  subtitle: Schema.NonEmptyString,
  funnelLabel: Schema.NonEmptyString,
  funnelHref: Schema.NonEmptyString,
});
export type HomeHeroViewModel = typeof HomeHeroViewModel.Type;

export const makeHomeHeroViewModel = (i18n: I18n, funnelHref: string) =>
  HomeHeroViewModel.make({
    title: i18n._({ id: "homePage.hero.title" }),
    subtitle: i18n._({ id: "homePage.hero.subtitle" }),
    funnelLabel: i18n._({ id: "homePage.hero.funnel" }),
    funnelHref,
  });

export const HomePageViewModel = Schema.TaggedUnion({
  Loaded: {
    shell: AppShellViewModel,
    hero: HomeHeroViewModel,
    form: SearchFormViewModel,
    person: PersonViewModel,
    filmList: FilmListViewModel,
  },
  Failed: {
    shell: AppShellViewModel,
    hero: HomeHeroViewModel,
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
  funnelHref: Schema.NonEmptyString,
  shell: AppShellViewModel,
  person: PersonViewModel,
  filmList: FilmListViewModel,
});
export type LoadedHomePageInput = typeof LoadedHomePageInput.Type;

export const FailedHomePageInput = Schema.Struct({
  formValue: Schema.String,
  funnelHref: Schema.NonEmptyString,
  shell: AppShellViewModel,
});
export type FailedHomePageInput = typeof FailedHomePageInput.Type;

export const makeLoadedHomePageModel = (
  i18n: I18n,
  input: LoadedHomePageInput,
) =>
  HomePageViewModel.cases.Loaded.make({
    shell: input.shell,
    hero: makeHomeHeroViewModel(i18n, input.funnelHref),
    form: makeInitialSearchFormViewModel(i18n, input.formValue),
    person: input.person,
    filmList: input.filmList,
  });

export const makeFailedHomePageModel = (
  i18n: I18n,
  input: FailedHomePageInput,
) =>
  HomePageViewModel.cases.Failed.make({
    shell: input.shell,
    hero: makeHomeHeroViewModel(i18n, input.funnelHref),
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

const HomeHero = ({ hero }: { readonly hero: HomeHeroViewModel }) => (
  <section className="hero rounded-box bg-base-100 shadow-xl">
    <div className="hero-content py-10 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold">{hero.title}</h1>
        <p className="py-4 text-base-content/70">{hero.subtitle}</p>
        <a href={hero.funnelHref} className="btn btn-primary">
          {hero.funnelLabel}
        </a>
      </div>
    </div>
  </section>
);

const LoadedHomePage = ({
  dispatch,
  isPending,
  ...model
}: LoadedHomePageProps) => (
  <div className="flex flex-col gap-6">
    <HomeHero hero={model.hero} />
    <div className="grid gap-6 lg:grid-cols-2">
      <PersonCard {...model.person} />
      <div className="flex flex-col gap-6">
        <FilmList {...model.filmList} />
        <SearchForm
          {...model.form}
          dispatch={dispatch}
          isPending={isPending}
        />
      </div>
    </div>
  </div>
);

const FailedHomePage = ({
  dispatch,
  isPending,
  ...model
}: FailedHomePageProps) => (
  <div className="flex flex-col gap-6">
    <HomeHero hero={model.hero} />
    <div role="alert" className="alert alert-error">
      {model.message}
    </div>
    <SearchForm
      {...model.form}
      dispatch={dispatch}
      isPending={isPending}
    />
  </div>
);

export const HomePage = ({
  dispatch,
  isPending,
  ...model
}: HomePageProps) =>
  HomePageViewModel.match(model, {
    Loaded: (loaded) => (
      <AppShell {...loaded.shell}>
        <LoadedHomePage
          {...loaded}
          dispatch={dispatch}
          isPending={isPending}
        />
      </AppShell>
    ),
    Failed: (failed) => (
      <AppShell {...failed.shell}>
        <FailedHomePage
          {...failed}
          dispatch={dispatch}
          isPending={isPending}
        />
      </AppShell>
    ),
  });
