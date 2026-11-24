import { SearchFormViewModel } from "./SearchForm.model";

export const makeSearchFormViewModel = (
  characterId: string,
): SearchFormViewModel =>
  SearchFormViewModel.make({
    characterId,
    label: "Character id",
    submitLabel: "Load character",
    pendingLabel: "Loading...",
  });
