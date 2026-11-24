import { Schema } from "effect";

export const SearchFormViewModel = Schema.TaggedStruct("SearchFormViewModel", {
  characterId: Schema.String,
});
export type SearchFormViewModel = typeof SearchFormViewModel.Type;
