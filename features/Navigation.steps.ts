import { Bdd } from "effect-bdd";
import {
  chooseUniverseNamed,
  environment,
  givenTheAppIsRunning,
  openBrand,
  openFunnel,
  openHome,
  openPath,
  see,
  theAddressIs,
  theDocumentLanguageIs,
  theLinkPointsTo,
  theLocaleIs,
  theThemeIs,
  theUniverseIs,
} from "./support/Steps";

const route = Bdd.scenario(
  "A route resolves its locale and universe",
).pipe(
  givenTheAppIsRunning,
  openPath,
  theAddressIs,
  see,
  theDocumentLanguageIs,
  theThemeIs,
  Bdd.provide(environment("navigation", "route")),
);

const headerSwitch = Bdd.scenario(
  "The header switches the universe and keeps the locale",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  openHome,
  chooseUniverseNamed,
  see,
  theThemeIs,
  theDocumentLanguageIs,
  theAddressIs,
  Bdd.provide(environment("navigation", "switch")),
);

const brand = Bdd.scenario(
  "The brand returns to the app home",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  openFunnel,
  openBrand,
  see,
  theAddressIs,
  theDocumentLanguageIs,
  Bdd.provide(environment("navigation", "brand")),
);

const notFound = Bdd.scenario(
  "An unknown universe renders NotFound",
).pipe(
  givenTheAppIsRunning,
  openPath,
  theAddressIs,
  see,
  see,
  theLinkPointsTo,
  theDocumentLanguageIs,
  Bdd.provide(environment("navigation", "not-found")),
);

export const navigationFeature = Bdd.feature(
  "Moving between universes and locales",
).pipe(route, headerSwitch, brand, notFound);
