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
  "person.unknownMeasurement": "Unknown",
} as const;

const filmListMessages = {
  "film.episodeLabel": "Episode",
  "film.listItem": "{title} ({episodeLabel} {episodeId, number})",
  "film.count": "{count, plural, one {# film} other {# films}}",
} as const;

const homePageMessages = {
  "homePage.loadError": "The character could not be loaded.",
} as const;

export const MESSAGES = {
  ...characterIdMessages,
  ...searchFormMessages,
  ...personCardMessages,
  ...filmListMessages,
  ...homePageMessages,
} as const;
