import { Schema } from "effect";
import { FilmListViewModel } from "../../components/FilmList/FilmList.model";
import { PersonViewModel } from "../../components/PersonCard/PersonCard.model";
import { SearchFormViewModel } from "../../components/SearchForm/SearchForm.model";

export const HomePageViewModel = Schema.TaggedUnion({
  Loaded: {
    form: SearchFormViewModel,
    person: PersonViewModel,
    filmList: FilmListViewModel,
  },
  Failed: {
    form: SearchFormViewModel,
    message: Schema.NonEmptyString,
  },
});
export type HomePageViewModel = typeof HomePageViewModel.Type;
