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

const shellMessages = {
  "shell.brand": "Character Dossier",
  "shell.starWars": "Star Wars",
  "shell.ghibli": "Ghibli",
} as const;

const homePageMessages = {
  "home.starWars.title": "Star Wars character dossier",
  "home.starWars.subtitle":
    "Build a dossier from the Star Wars universe.",
  "home.ghibli.title": "Studio Ghibli character dossier",
  "home.ghibli.subtitle":
    "Build a dossier from the Studio Ghibli universe.",
  "home.hero.funnel": "Build a dossier",
} as const;

const funnelMessages = {
  "funnel.step.progress": "Step {step, number} of {total, number}",
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
  "funnel.choose.subtitle":
    "{count, plural, one {One character matched.} other {# characters matched.}} Pick the one whose dossier you want to build.",
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
  "funnel.failed.subtitle": "Start over to try again.",
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
  ...personCardMessages,
  ...shellMessages,
  ...homePageMessages,
  ...funnelMessages,
  ...resultsMessages,
} as const;
