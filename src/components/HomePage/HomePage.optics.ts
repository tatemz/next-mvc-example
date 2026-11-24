import { Prism } from "@fuiste/optics";
import { SearchFormOptics } from "../SearchForm/SearchForm.optics";
import type { HomePageViewModel } from "./HomePage.model";

const FormPrism = Prism<HomePageViewModel>().of({
  get: (model) => model.form,
  set: (form) => (model) => ({ ...model, form }),
});

export const HomePageOptics = {
  FormValue: Prism<HomePageViewModel>().compose(
    FormPrism,
    SearchFormOptics.Value,
  ),
  FormError: Prism<HomePageViewModel>().compose(
    FormPrism,
    SearchFormOptics.Error,
  ),
};
