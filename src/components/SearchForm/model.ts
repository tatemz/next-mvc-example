import { Schema } from "effect";

export const SearchFormViewModel = Schema.Struct({
  characterId: Schema.String,
});
export type SearchFormViewModel = typeof SearchFormViewModel.Type;
