import { Schema } from "effect";
import { FilmListItemViewModel } from "../FilmListItem/FilmListItem.model";

export const FilmListViewModel = Schema.TaggedStruct("FilmListViewModel", {
  films: Schema.NonEmptyArray(FilmListItemViewModel),
  countLabel: Schema.NonEmptyString,
});
export type FilmListViewModel = typeof FilmListViewModel.Type;
