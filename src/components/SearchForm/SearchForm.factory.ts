import { SearchFormViewModel } from "./SearchForm.model";

export const makeInitialSearchFormViewModel = (
  value: string,
): SearchFormViewModel =>
  SearchFormViewModel.make({
    value,
    label: "Character id",
    submitLabel: "Load character",
    pendingLabel: "Loading...",
  });

export const makeRetrySearchFormViewModel = (
  value: string,
): SearchFormViewModel =>
  SearchFormViewModel.make({
    value,
    label: "Character id",
    submitLabel: "Try again",
    pendingLabel: "Loading...",
  });
