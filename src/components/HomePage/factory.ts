import type { Person } from "../../domain/Person";
import type { SearchFormViewModel } from "../SearchForm/model";
import { HomePageViewModel } from "./model";

export const makeLoadedHomePageModel = (person: Person): HomePageViewModel =>
  HomePageViewModel.cases.Loaded.make({
    form: { characterId: String(person.id) },
    person: {
      name: person.name,
      height: person.height,
      mass: person.mass,
    },
    films: person.films,
  });

export const makeFailedHomePageModel = (options: {
  readonly form: SearchFormViewModel;
  readonly message: string;
}): HomePageViewModel =>
  HomePageViewModel.cases.Failed.make({
    form: options.form,
    message: options.message,
  });
