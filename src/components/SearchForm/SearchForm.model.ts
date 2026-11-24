import { Schema } from "effect";

export const SearchFormViewModel = Schema.TaggedStruct("SearchFormViewModel", {
  characterId: Schema.String,
  label: Schema.NonEmptyString,
  submitLabel: Schema.NonEmptyString,
  pendingLabel: Schema.NonEmptyString,
});
export type SearchFormViewModel = typeof SearchFormViewModel.Type;
