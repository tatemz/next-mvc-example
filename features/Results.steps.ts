import { Bdd } from "effect-bdd";
import {
  environment,
  givenTheAppIsRunning,
  openResults,
  see,
  theThemeIs,
  theUniverseIs,
} from "./support/Steps";

const completeDossier = Bdd.scenario(
  "Opening a complete dossier",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  openResults,
  see,
  see,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("results", "complete")),
);

const invalidDossier = Bdd.scenario(
  "Rejecting an invalid dossier",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  openResults,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("results", "invalid")),
);

export const results = Bdd.feature("Opening a dossier").pipe(
  completeDossier,
  invalidDossier,
);
