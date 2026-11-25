import { Effect, Function } from "effect";
import type { ExperienceTheme } from "../components/AppShell";
import {
  type HomePageViewModel,
  HomePageOptics,
} from "../components/HomePage";
import { getStringOrEmpty } from "../forms/FormData";
import { I18n } from "../i18n/I18n.service";
import { loadHomePageFor } from "./HomePage.controller";
import {
  type SearchFormValidationError,
  validateSearchForm,
} from "./SearchPerson.schema";

const handleValidationError =
  (previous: HomePageViewModel) =>
  (error: SearchFormValidationError) =>
    Effect.gen(function*() {
      const i18n = yield* I18n;
      const formValue = getStringOrEmpty(error.formData, "characterId");
      const message = i18n._({ id: error.errors.characterId });

      return Function.pipe(
        previous,
        HomePageOptics.FormValue.set(formValue),
        HomePageOptics.FormError.set(message),
      );
    });

const searchPersonEffect = Effect.fn("searchPerson")(
  function*(
    formData: FormData,
    funnelHref: string,
    theme: ExperienceTheme,
  ) {
    const data = yield* validateSearchForm(formData);
    return yield* loadHomePageFor(data.characterId, funnelHref, theme);
  },
);

export const searchPerson = (
  previous: HomePageViewModel,
  formData: FormData,
  funnelHref: string,
  theme: ExperienceTheme,
) =>
  Function.pipe(
    searchPersonEffect(formData, funnelHref, theme),
    Effect.catchTag("FormValidationError", handleValidationError(previous)),
  );
