import { Effect, Function } from "effect";
import {
  type HomePageViewModel,
  HomePageOptics,
} from "../components/HomePage/HomePage";
import {
  type SearchFormValidationError,
  validateSearchForm,
} from "./SearchPerson.schema";
import { getString } from "../forms/FormData";
import { I18n } from "../i18n/I18n.service";
import { loadHomePageFor } from "./HomePage.controller";

const handleValidationError =
  (previous: HomePageViewModel) =>
  (error: SearchFormValidationError) =>
    Effect.gen(function*() {
      const i18n = yield* I18n;
      const formValue = getString(error.formData, "characterId");
      const message = i18n._({ id: error.errors.characterId });

      return Function.pipe(
        previous,
        HomePageOptics.FormValue.set(formValue),
        HomePageOptics.FormError.set(message),
      );
    });

const searchPersonEffect = Effect.fn("searchPerson")(
  function*(formData: FormData) {
    const data = yield* validateSearchForm(formData);
    return yield* loadHomePageFor(data.characterId);
  },
);

export const searchPerson = (
  previous: HomePageViewModel,
  formData: FormData,
) =>
  Function.pipe(
    searchPersonEffect(formData),
    Effect.catchTag("FormValidationError", handleValidationError(previous)),
  );
