import { Schema } from "effect";
import { FilmListViewModel } from "../FilmList/model";
import { PersonViewModel } from "../PersonCard/model";
import { SearchFormViewModel } from "../SearchForm/model";

export const HomePageViewModel = Schema.TaggedUnion({
  Loaded: {
    form: SearchFormViewModel,
    person: PersonViewModel,
    films: FilmListViewModel,
  },
  Failed: {
    form: SearchFormViewModel,
    message: Schema.NonEmptyString,
  },
});
export type HomePageViewModel = typeof HomePageViewModel.Type;
