import { Bdd } from "effect-bdd";
import {
  chooseLanguage,
  environment,
  givenTheAppIsRunning,
  openFunnelFromHome,
  openHome,
  see,
  theLocaleIs,
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

const spanishSplash = Bdd.scenario(
  "The splash uses Mexican Spanish",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  openHome,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("home", "spanish")),
);

const switchToEnglish = Bdd.scenario(
  "The header switches back to US English",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  openHome,
  chooseLanguage,
  see,
  Bdd.provide(environment("home", "switch")),
);

export const home = Bdd.feature("The universe splash").pipe(
  splash,
  funnelFromHome,
  spanishSplash,
  switchToEnglish,
);
