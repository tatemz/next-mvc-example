import { Bdd } from "effect-bdd";
import {
  chooseLanguage,
  environment,
  givenTheAppIsRunning,
  openFunnelFromHome,
  openHome,
  see,
  theAddressIs,
  theDocumentLanguageIs,
  theLocaleIs,
  theThemeIs,
  theUniverseIs,
} from "./support/Steps";

const splash = Bdd.scenario(
  "The splash introduces the universe",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  openHome,
  see,
  see,
  theThemeIs,
  theDocumentLanguageIs,
  Bdd.provide(environment("home", "splash")),
);

const funnelFromHome = Bdd.scenario(
  "The splash CTA opens the funnel",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  openHome,
  openFunnelFromHome,
  see,
  theThemeIs,
  theAddressIs,
  Bdd.provide(environment("home", "cta")),
);

const languageSwitch = Bdd.scenario(
  "The language switch keeps the universe",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  openHome,
  chooseLanguage,
  see,
  theDocumentLanguageIs,
  theThemeIs,
  theAddressIs,
  Bdd.provide(environment("home", "switch")),
);

export const home = Bdd.feature("The universe splash").pipe(
  splash,
  funnelFromHome,
  languageSwitch,
);
