import { Array, Option } from "effect";
import {
  makeAppShellViewModel,
  type AppShellViewModel,
  type ExperienceTheme,
} from "../src/components/AppShell";
import {
  makeFunnelChooseViewModel,
  makeFunnelFailedViewModel,
  makeFunnelFilmViewModel,
  makeFunnelReviewViewModel,
  makeFunnelSearchViewModel,
  makeFunnelTransportViewModel,
  PersonChoiceViewModel,
  type FunnelViewModel,
} from "../src/components/Funnel";
import type { FilmListItemViewModel } from "../src/components/FilmListItem";
import {
  HomePageOptics,
  makeFailedHomePageModel,
  type HomePageViewModel,
} from "../src/components/HomePage";
import {
  makePersonViewModel,
  type PersonViewModel,
  type TransportViewModel,
} from "../src/components/PersonCard";
import {
  makeResultsMissingViewModel,
  makeResultsReadyViewModel,
  type ResultsViewModel,
} from "../src/components/Results";
import { presentLoadedHomePage } from "../src/controllers/HomePage.controller";
import { luke, makeCharacterId } from "../src/domain/FilmUniverse.fixture";
import type { Person } from "../src/domain/FilmUniverse.model";
import { makeEn } from "../src/i18n/I18n.service";

const i18n = makeEn();


const haku: Person = {
  _tag: "Person",
  id: makeCharacterId("1"),
  name: "Haku",
  height: "unknown",
  mass: "unknown",
  birthYear: "unknown",
  gender: "male",
  origin: {
    _tag: "Origin",
    name: "Ghibli",
    climate: "unknown",
    terrain: "unknown",
  },
  species: {
    _tag: "Species",
    name: "Dragon",
    classification: "unknown",
    language: "unknown",
  },
  films: [
    {
      _tag: "Film",
      title: "Spirited Away",
      order: 1,
      imageUrl:
        "https://image.tmdb.org/t/p/w600_and_h900_bestv2/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    },
  ],
  transports: [],
};

const porco: Person = {
  _tag: "Person",
  id: makeCharacterId("1"),
  name: "Porco Rosso",
  height: "unknown",
  mass: "unknown",
  birthYear: "unknown",
  gender: "male",
  origin: {
    _tag: "Origin",
    name: "Ghibli",
    climate: "unknown",
    terrain: "unknown",
  },
  species: {
    _tag: "Species",
    name: "Human",
    classification: "unknown",
    language: "unknown",
  },
  films: [
    {
      _tag: "Film",
      title: "Porco Rosso",
      order: 1,
      imageUrl:
        "https://image.tmdb.org/t/p/w600_and_h900_bestv2/byKAndF6KQSDpGxp1mTr23jPbYp.jpg",
    },
  ],
  transports: [
    {
      _tag: "Transport",
      key: "red-wing",
      kind: "Vehicle",
      name: "Red Wing",
      model: "Airplane",
    },
  ],
};

const humanLuke: Person = {
  ...luke,
  species: {
    _tag: "Species",
    name: "Human",
    classification: "mammal",
    language: "Galactic Basic",
  },
};

export type PageDataset = {
  readonly shell: AppShellViewModel;
  readonly person: Person;
  readonly view: PersonViewModel;
  readonly film: FilmListItemViewModel;
  readonly transport: TransportViewModel | null;
  readonly funnelHref: string;
  readonly homeHref: string;
  readonly query: string;
};

const datasetFor = (
  person: Person,
  theme: ExperienceTheme,
  basePath: string,
  query: string,
): PageDataset => {
  const view = makePersonViewModel(i18n, person);
  const film = Option.getOrThrow(Array.head(view.films));
  const transport = Option.getOrNull(Array.head(view.transports));

  return {
    shell: makeAppShellViewModel(i18n, theme),
    person,
    view,
    film,
    transport,
    funnelHref: `${basePath}/funnel`,
    homeHref: basePath,
    query,
  };
};

export const starWars = datasetFor(luke, "night", "/star-wars", "Luke");
export const starWarsHuman = datasetFor(
  humanLuke,
  "night",
  "/star-wars",
  "Luke",
);
export const ghibli = datasetFor(haku, "autumn", "/ghibli", "Haku");
export const ghibliPilot = datasetFor(
  porco,
  "autumn",
  "/ghibli",
  "Porco",
);

export const homeLoaded = (dataset: PageDataset): HomePageViewModel =>
  presentLoadedHomePage(
    i18n,
    dataset.person,
    dataset.funnelHref,
    dataset.shell,
  );

export const homeLoadedWithError = (
  dataset: PageDataset,
): HomePageViewModel =>
  HomePageOptics.FormError.set(
    i18n._({ id: "search.characterId.invalid" }),
  )(homeLoaded(dataset));

export const homeFailed = (
  dataset: PageDataset,
  formValue: string,
): HomePageViewModel =>
  HomePageOptics.FormValue.set(formValue)(
    makeFailedHomePageModel(i18n, {
      formValue: "",
      funnelHref: dataset.funnelHref,
      shell: dataset.shell,
    }),
  );

export const funnelSearch = (dataset: PageDataset): FunnelViewModel =>
  makeFunnelSearchViewModel(
    i18n,
    dataset.shell,
    dataset.query,
    undefined,
  );

export const funnelSearchWithError = (
  dataset: PageDataset,
): FunnelViewModel =>
  makeFunnelSearchViewModel(
    i18n,
    dataset.shell,
    "",
    i18n._({ id: "funnel.search.required" }),
  );

export const funnelChoose = (
  dataset: PageDataset,
  secondName: string,
): FunnelViewModel =>
  makeFunnelChooseViewModel(i18n, dataset.shell, dataset.query, [
    PersonChoiceViewModel.make({
      id: dataset.person.id,
      name: dataset.person.name,
    }),
    PersonChoiceViewModel.make({ id: "2", name: secondName }),
  ]);

export const funnelFilm = (dataset: PageDataset): FunnelViewModel =>
  makeFunnelFilmViewModel(i18n, dataset.shell, dataset.view);

export const funnelTransport = (dataset: PageDataset): FunnelViewModel =>
  makeFunnelTransportViewModel(
    i18n,
    dataset.shell,
    dataset.view,
    dataset.film,
  );

export const funnelReview = (
  dataset: PageDataset,
  transport: TransportViewModel | null,
): FunnelViewModel =>
  makeFunnelReviewViewModel(
    i18n,
    dataset.shell,
    dataset.view,
    dataset.film,
    transport,
  );

export const funnelFailed = (dataset: PageDataset): FunnelViewModel =>
  makeFunnelFailedViewModel(
    i18n,
    dataset.shell,
    i18n._({ id: "funnel.failed.message" }),
  );

export const funnelFailedInvalidChoice = (
  dataset: PageDataset,
): FunnelViewModel =>
  makeFunnelFailedViewModel(
    i18n,
    dataset.shell,
    i18n._({ id: "funnel.failed.invalidChoice" }),
  );

export const resultsReady = (
  dataset: PageDataset,
  transport: TransportViewModel | null,
): ResultsViewModel =>
  makeResultsReadyViewModel(
    i18n,
    dataset.shell,
    dataset.view,
    dataset.film,
    transport,
    dataset.funnelHref,
    dataset.homeHref,
  );

export const resultsMissing = (dataset: PageDataset): ResultsViewModel =>
  makeResultsMissingViewModel(
    i18n,
    dataset.shell,
    dataset.funnelHref,
  );
