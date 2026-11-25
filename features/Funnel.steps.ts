import { Bdd } from "effect-bdd";
import {
  chooseCharacter,
  chooseCharacterWithId,
  chooseFilm,
  chooseFilmWithOrder,
  chooseTransport,
  chooseTransportWithKey,
  environment,
  givenCharacterChoiceFailed,
  givenChoseCharacter,
  givenChoseFilm,
  givenChoseTransport,
  givenFunnelIsOpen,
  givenSearchedFor,
  givenTheAppIsRunning,
  openDossier,
  openFunnel,
  searchFor,
  searchWithoutQuery,
  see,
  seeContaining,
  startOver,
  theAddressIs,
  theCatalogueIs,
  theLinkPointsTo,
  theLocaleIs,
  theThemeIs,
  theUniverseIs,
} from "./support/Steps";

const searchOutcome = Bdd.scenario(
  "The search reports its outcome",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenFunnelIsOpen,
  searchFor,
  see,
  theThemeIs,
  Bdd.provide(environment("funnel", "search-outcome")),
);

const matchCount = Bdd.scenario(
  "The search reports how many characters matched",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenFunnelIsOpen,
  searchFor,
  seeContaining,
  Bdd.provide(environment("funnel", "match-count")),
);

const searchRequired = Bdd.scenario(
  "The search requires a character name",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenFunnelIsOpen,
  searchWithoutQuery,
  see,
  theThemeIs,
  Bdd.provide(environment("funnel", "search-required")),
);

const searchProgress = Bdd.scenario(
  "The search step reports its progress",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  openFunnel,
  see,
  see,
  Bdd.provide(environment("funnel", "search-progress")),
);

const chooseProgress = Bdd.scenario(
  "The search leads to the choose step",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenFunnelIsOpen,
  searchFor,
  see,
  see,
  Bdd.provide(environment("funnel", "choose-progress")),
);

const filmProgress = Bdd.scenario(
  "Choosing a character leads to the film step",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenSearchedFor,
  chooseCharacter,
  see,
  see,
  Bdd.provide(environment("funnel", "film-progress")),
);

const transportProgress = Bdd.scenario(
  "Choosing a film leads to the transport step",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenChoseCharacter,
  chooseFilm,
  see,
  see,
  Bdd.provide(environment("funnel", "transport-progress")),
);

const reviewProgress = Bdd.scenario(
  "Choosing a transport leads to the review step",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenChoseFilm,
  chooseTransport,
  see,
  see,
  Bdd.provide(environment("funnel", "review-progress")),
);

const review = Bdd.scenario(
  "Reviewing a dossier",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenChoseFilm,
  chooseTransport,
  see,
  theLinkPointsTo,
  theLinkPointsTo,
  theThemeIs,
  Bdd.provide(environment("funnel", "review")),
);

const open = Bdd.scenario(
  "Opening a dossier",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenChoseTransport,
  openDossier,
  see,
  see,
  see,
  see,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("funnel", "open")),
);

const unknownCharacter = Bdd.scenario(
  "Rejecting an unknown character choice",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenSearchedFor,
  chooseCharacterWithId,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("funnel", "unknown-character")),
);

const emptyCharacter = Bdd.scenario(
  "Rejecting an empty character choice",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenSearchedFor,
  chooseCharacterWithId,
  see,
  see,
  Bdd.provide(environment("funnel", "empty-character")),
);

const unknownFilm = Bdd.scenario(
  "Rejecting an unknown film",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenChoseCharacter,
  chooseFilmWithOrder,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("funnel", "unknown-film")),
);

const emptyFilm = Bdd.scenario(
  "Rejecting an empty film choice",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenChoseCharacter,
  chooseFilmWithOrder,
  see,
  see,
  Bdd.provide(environment("funnel", "empty-film")),
);

const unknownTransport = Bdd.scenario(
  "Rejecting an unknown transport",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenChoseFilm,
  chooseTransportWithKey,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("funnel", "unknown-transport")),
);

const emptyTransport = Bdd.scenario(
  "Rejecting an empty transport choice",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenChoseFilm,
  chooseTransportWithKey,
  see,
  see,
  Bdd.provide(environment("funnel", "empty-transport")),
);

const unavailableSearch = Bdd.scenario(
  "Reporting an unavailable catalogue while searching",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  theCatalogueIs,
  givenFunnelIsOpen,
  searchFor,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("funnel", "unavailable-search")),
);

const unavailableChoose = Bdd.scenario(
  "Reporting an unavailable catalogue while choosing",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenSearchedFor,
  theCatalogueIs,
  chooseCharacter,
  see,
  see,
  theThemeIs,
  Bdd.provide(environment("funnel", "unavailable-choose")),
);

const startOverReview = Bdd.scenario(
  "Starting over from the review",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenChoseTransport,
  startOver,
  see,
  theAddressIs,
  theThemeIs,
  Bdd.provide(environment("funnel", "start-over-review")),
);

const startOverFailure = Bdd.scenario(
  "Starting over from a failure",
).pipe(
  givenTheAppIsRunning,
  theUniverseIs,
  theLocaleIs,
  givenSearchedFor,
  givenCharacterChoiceFailed,
  startOver,
  see,
  theAddressIs,
  theThemeIs,
  Bdd.provide(environment("funnel", "start-over-failure")),
);

export const funnel = Bdd.feature("Building a dossier").pipe(
  searchOutcome,
  matchCount,
  searchRequired,
  searchProgress,
  chooseProgress,
  filmProgress,
  transportProgress,
  reviewProgress,
  review,
  open,
  unknownCharacter,
  emptyCharacter,
  unknownFilm,
  emptyFilm,
  unknownTransport,
  emptyTransport,
  unavailableSearch,
  unavailableChoose,
  startOverReview,
  startOverFailure,
);
