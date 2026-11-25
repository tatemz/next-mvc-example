import { Bdd } from "effect-bdd";
import {
  chooseCharacter,
  chooseFilm,
  chooseTransport,
  environment,
  givenTheAppIsRunning,
  openDossier,
  openFunnel,
  searchFor,
  see,
  theCatalogueIs,
  theThemeIs,
  theUniverseIs,
} from "./support/Steps";

const reviewDossier = Bdd.scenario("Reviewing a dossier").pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  openFunnel,
  searchFor,
  chooseCharacter,
  chooseFilm,
  chooseTransport,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("funnel", "review")),
);

const openDossierScenario = Bdd.scenario("Opening a dossier").pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  openFunnel,
  searchFor,
  chooseCharacter,
  chooseFilm,
  chooseTransport,
  openDossier,
  see,
  see,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("funnel", "open")),
);

const noMatches = Bdd.scenario("No characters match").pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  openFunnel,
  searchFor,
  see,
  theThemeIs,
  Bdd.provide(environment("funnel", "no-matches")),
);

const unavailable = Bdd.scenario(
  "Reporting an unavailable catalogue",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theCatalogueIs,
  openFunnel,
  searchFor,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("funnel", "unavailable")),
);

export const funnel = Bdd.feature("Building a dossier").pipe(
  reviewDossier,
  openDossierScenario,
  noMatches,
  unavailable,
);
