const characterIdMessages = {
  "characterId.label": "Character id",
  "search.characterId.required": "Character id is required.",
  "search.characterId.invalid":
    "Character id must be a positive whole number.",
} as const;

const searchFormMessages = {
  "search.submit": "Load character",
  "search.retry": "Try again",
  "search.pending": "Loading...",
} as const;

const personCardMessages = {
  "person.heightLabel": "Height",
  "person.massLabel": "Mass",
  "person.birthYearLabel": "Born",
  "person.genderLabel": "Gender",
  "person.originLabel": "Origin",
  "person.speciesLabel": "Species",
  "person.unknownMeasurement": "Unknown",
  "person.unknownSpecies": "Unknown species",
} as const;

const filmListMessages = {
  "film.count": "{count, plural, one {# film} other {# films}}",
} as const;

const shellMessages = {
  "shell.brand": "Character Dossier",
  "shell.starWars": "Star Wars",
  "shell.ghibli": "Ghibli",
} as const;

const homePageMessages = {
  "homePage.loadError": "The character could not be loaded.",
  "homePage.hero.title": "One dossier, two universes",
  "homePage.hero.subtitle":
    "The same controller and views, served from Star Wars or Studio Ghibli.",
  "homePage.hero.funnel": "Build a dossier",
} as const;

const funnelMessages = {
  "funnel.step.search": "Step 1 of 4",
  "funnel.step.choose": "Step 2 of 4",
  "funnel.step.film": "Step 3 of 4",
  "funnel.step.transport": "Step 4 of 4",
  "funnel.step.review": "Review",
  "funnel.step.failed": "Something went wrong",
  "funnel.search.heading": "Find a character",
  "funnel.search.subtitle": "Search the character API by name.",
  "funnel.search.label": "Character name",
  "funnel.search.placeholder": "Search by name",
  "funnel.search.submit": "Search",
  "funnel.search.required": "Enter a character name.",
  "funnel.search.noResults": "No characters matched that name.",
  "funnel.choose.heading": "Choose a character",
  "funnel.choose.subtitle": "Pick the character whose dossier you want to build.",
  "funnel.choose.submit": "Choose character",
  "funnel.film.heading": "Choose a film",
  "funnel.film.subtitle": "Pick the film that anchors the dossier.",
  "funnel.film.submit": "Next: transport",
  "funnel.transport.heading": "Choose a transport",
  "funnel.transport.subtitle":
    "Pick a starship or vehicle, or skip this step.",
  "funnel.transport.submit": "Review dossier",
  "funnel.transport.none": "No transport",
  "funnel.review.heading": "Ready for the dossier",
  "funnel.review.subtitle":
    "Review the choices, then open the results page.",
  "funnel.review.film": "Film",
  "funnel.review.transport": "Transport",
  "funnel.review.open": "Open dossier",
  "funnel.review.startOver": "Start over",
  "funnel.failed.heading": "The dossier could not be built",
  "funnel.failed.message": "The character API could not answer.",
  "funnel.failed.invalidChoice": "That choice is no longer available.",
  "funnel.failed.startOver": "Start over",
  "funnel.pending": "Loading...",
} as const;

const resultsMessages = {
  "results.ready.heading": "Your dossier",
  "results.ready.subtitle":
    "The choices from your funnel, loaded from the character API.",
  "results.ready.filmLabel": "Film",
  "results.ready.transportLabel": "Transport",
  "results.ready.noneTransport": "No transport selected",
  "results.ready.startOver": "Build another dossier",
  "results.ready.home": "Back home",
  "results.missing.heading": "Dossier not found",
  "results.missing.message":
    "That dossier is incomplete, or the character could not be loaded.",
  "results.missing.startOver": "Build a dossier",
} as const;

export const MESSAGES = {
  ...characterIdMessages,
  ...searchFormMessages,
  ...personCardMessages,
  ...filmListMessages,
  ...shellMessages,
  ...homePageMessages,
  ...funnelMessages,
  ...resultsMessages,
} as const;
