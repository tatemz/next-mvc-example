import { SearchFormViewModel } from "./SearchForm.model";

export const makeInitialSearchFormViewModel = (
  characterId: string,
): SearchFormViewModel =>
  SearchFormViewModel.make({
    characterId,
    label: "Character id",
    submitLabel: "Load character",
    pendingLabel: "Loading...",
  });

export const makeRetrySearchFormViewModel = (
  characterId: string,
): SearchFormViewModel =>
  SearchFormViewModel.make({
    characterId,
    label: "Character id",
    submitLabel: "Try again",
    pendingLabel: "Loading...",
  });
