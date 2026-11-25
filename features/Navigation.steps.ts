import { Bdd } from "effect-bdd";
import {
  chooseUniverse,
  environment,
  givenTheAppIsRunning,
  openRoot,
  see,
  theThemeIs,
  theUniverseIs,
} from "./support/Steps";

const navigation = Bdd.scenario(
  "The header opens the universe",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  openRoot,
  chooseUniverse,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("navigation", "header")),
);

export const navigationFeature = Bdd.feature(
  "Moving between the universes",
).pipe(navigation);
