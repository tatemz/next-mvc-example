import { Array, Option } from "effect";
import {
  makeAppShellViewModel,
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
import {
  HomePageOptics,
  makeFailedHomePageModel,
  type HomePageViewModel,
} from "../src/components/HomePage";
import {
  makePersonViewModel,
  type PersonViewModel,
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

const shellFor = (theme: ExperienceTheme) =>
  makeAppShellViewModel(i18n, theme);

const nightShell = shellFor("night");
const autumnShell = shellFor("autumn");

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

const humanLuke: Person = {
  ...luke,
  species: {
    _tag: "Species",
    name: "Human",
    classification: "mammal",
    language: "Galactic Basic",
  },
};

const starWarsPerson = makePersonViewModel(i18n, luke);
const humanPerson = makePersonViewModel(i18n, humanLuke);
const ghibliPerson = makePersonViewModel(i18n, haku);

const firstFilm = (person: PersonViewModel) =>
  Option.getOrThrow(Array.head(person.films));

const firstTransport = (person: PersonViewModel) =>
  Option.getOrThrow(Array.head(person.transports));

const starWarsFilm = firstFilm(starWarsPerson);
const ghibliFilm = firstFilm(ghibliPerson);
const starWarsTransport = firstTransport(starWarsPerson);

export const homeLoaded: HomePageViewModel = presentLoadedHomePage(
  i18n,
  luke,
  "/star-wars/funnel",
  nightShell,
);

export const homeLoadedWithSpecies: HomePageViewModel =
  presentLoadedHomePage(
    i18n,
    humanLuke,
    "/star-wars/funnel",
    nightShell,
  );

export const homeLoadedGhibli: HomePageViewModel = presentLoadedHomePage(
  i18n,
  haku,
  "/ghibli/funnel",
  autumnShell,
);

export const homeLoadedWithError: HomePageViewModel =
  HomePageOptics.FormError.set(
    i18n._({ id: "search.characterId.invalid" }),
  )(homeLoaded);

export const homeFailed: HomePageViewModel = HomePageOptics.FormValue.set(
  "abc",
)(
  makeFailedHomePageModel(i18n, {
    formValue: "",
    funnelHref: "/star-wars/funnel",
    shell: nightShell,
  }),
);

export const homeFailedGhibli: HomePageViewModel =
  HomePageOptics.FormValue.set("999")(
    makeFailedHomePageModel(i18n, {
      formValue: "",
      funnelHref: "/ghibli/funnel",
      shell: autumnShell,
    }),
  );

const choices = [
  PersonChoiceViewModel.make({ id: "1", name: "Luke Skywalker" }),
  PersonChoiceViewModel.make({ id: "2", name: "Leia Organa" }),
] as const;

export const funnelSearch: FunnelViewModel = makeFunnelSearchViewModel(
  i18n,
  nightShell,
  "Luke",
  undefined,
);

export const funnelSearchWithError: FunnelViewModel =
  makeFunnelSearchViewModel(
    i18n,
    nightShell,
    "",
    i18n._({ id: "funnel.search.required" }),
  );

export const funnelChoose: FunnelViewModel = makeFunnelChooseViewModel(
  i18n,
  nightShell,
  "Luke",
  choices,
);

export const funnelFilm: FunnelViewModel = makeFunnelFilmViewModel(
  i18n,
  nightShell,
  starWarsPerson,
);

export const funnelFilmGhibli: FunnelViewModel = makeFunnelFilmViewModel(
  i18n,
  autumnShell,
  ghibliPerson,
);

export const funnelTransport: FunnelViewModel =
  makeFunnelTransportViewModel(
    i18n,
    nightShell,
    starWarsPerson,
    starWarsFilm,
  );

export const funnelTransportGhibli: FunnelViewModel =
  makeFunnelTransportViewModel(
    i18n,
    autumnShell,
    ghibliPerson,
    ghibliFilm,
  );

export const funnelReview: FunnelViewModel = makeFunnelReviewViewModel(
  i18n,
  nightShell,
  starWarsPerson,
  starWarsFilm,
  starWarsTransport,
);

export const funnelReviewWithSpecies: FunnelViewModel =
  makeFunnelReviewViewModel(
    i18n,
    nightShell,
    humanPerson,
    firstFilm(humanPerson),
    firstTransport(humanPerson),
  );

export const funnelReviewNoTransport: FunnelViewModel =
  makeFunnelReviewViewModel(
    i18n,
    autumnShell,
    ghibliPerson,
    ghibliFilm,
    null,
  );

export const funnelFailed: FunnelViewModel = makeFunnelFailedViewModel(
  i18n,
  nightShell,
  i18n._({ id: "funnel.failed.message" }),
);

export const funnelFailedInvalidChoice: FunnelViewModel =
  makeFunnelFailedViewModel(
    i18n,
    nightShell,
    i18n._({ id: "funnel.failed.invalidChoice" }),
  );

export const resultsReady: ResultsViewModel = makeResultsReadyViewModel(
  i18n,
  nightShell,
  starWarsPerson,
  starWarsFilm,
  starWarsTransport,
  "/star-wars/funnel",
  "/star-wars",
);

export const resultsReadyNoTransport: ResultsViewModel =
  makeResultsReadyViewModel(
    i18n,
    nightShell,
    starWarsPerson,
    starWarsFilm,
    null,
    "/star-wars/funnel",
    "/star-wars",
  );

export const resultsReadyGhibli: ResultsViewModel =
  makeResultsReadyViewModel(
    i18n,
    autumnShell,
    ghibliPerson,
    ghibliFilm,
    null,
    "/ghibli/funnel",
    "/ghibli",
  );

export const resultsMissing: ResultsViewModel = makeResultsMissingViewModel(
  i18n,
  nightShell,
  "/star-wars/funnel",
);

export const resultsMissingGhibli: ResultsViewModel =
  makeResultsMissingViewModel(
    i18n,
    autumnShell,
    "/ghibli/funnel",
  );
