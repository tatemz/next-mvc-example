import { Bdd } from "effect-bdd";
import {
  environment,
  givenTheAppIsRunning,
  openFunnelFromHome,
  openHome,
  see,
  theThemeIs,
  theUniverseIs,
} from "./support/Steps";

const splash = Bdd.scenario(
  "The splash introduces the universe",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  openHome,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("home", "splash")),
);

const funnelFromHome = Bdd.scenario(
  "The splash CTA opens the funnel",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  openHome,
  openFunnelFromHome,
  see,
  theThemeIs,
  Bdd.provide(environment("home", "cta")),
);

export const home = Bdd.feature("The universe splash").pipe(
  splash,
  funnelFromHome,
);
