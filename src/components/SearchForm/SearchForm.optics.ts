import { Lens } from "@fuiste/optics";
import type { SearchFormViewModel } from "./SearchForm.model";

export const SearchFormOptics = {
  Value: Lens<SearchFormViewModel>().prop("value"),
  Error: Lens<SearchFormViewModel>().prop("error"),
};
