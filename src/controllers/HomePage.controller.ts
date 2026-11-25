import { Config, Effect, Function } from "effect";
import type {
  AppShellViewModel,
  ExperienceTheme,
} from "../components/AppShell";
import { makeFilmListViewModel } from "../components/FilmList";
import {
  makeFailedHomePageModel,
  makeLoadedHomePageModel,
} from "../components/HomePage";
import { makePersonViewModel } from "../components/PersonCard";
import { CharacterId, type Person } from "../domain/FilmUniverse.model";
import { I18n } from "../i18n/I18n.service";
import { PeopleCatalog } from "../services/PeopleCatalog";
import { loadAppShell } from "./AppShell.controller";

export const presentLoadedHomePage = (
  i18n: I18n,
  person: Person,
  funnelHref: string,
  shell: AppShellViewModel,
) => {
  const personViewModel = makePersonViewModel(i18n, person);
  const filmListViewModel = makeFilmListViewModel(
    i18n,
    personViewModel.films,
  );

  return makeLoadedHomePageModel(i18n, {
    formValue: person.id,
    funnelHref,
    shell,
    person: personViewModel,
    filmList: filmListViewModel,
  });
};

const loadHomePageForEffect = Effect.fn("loadHomePageFor")(
  function*(characterId: CharacterId) {
    const client = yield* PeopleCatalog;
    return yield* client.getPerson(characterId);
  },
);

export const loadHomePageFor = (
  characterId: CharacterId,
  funnelHref: string,
  theme: ExperienceTheme,
) =>
  Effect.gen(function*() {
    const shell = yield* loadAppShell(theme);

    return yield* loadHomePageForEffect(characterId).pipe(
      Effect.matchEffect({
        onFailure: () =>
          Effect.gen(function*() {
            const i18n = yield* I18n;
            return makeFailedHomePageModel(i18n, {
              formValue: characterId,
              funnelHref,
              shell,
            });
          }),
        onSuccess: (person) =>
          Effect.gen(function*() {
            const i18n = yield* I18n;
            return presentLoadedHomePage(i18n, person, funnelHref, shell);
          }),
      }),
    );
  });

const loadHomePageEffect = (funnelHref: string, theme: ExperienceTheme) =>
  Effect.gen(function*() {
    const characterId = yield* Config.schema(CharacterId, "CHARACTER_ID");
    return yield* loadHomePageFor(characterId, funnelHref, theme);
  });

export const loadHomePage = (
  funnelHref: string,
  theme: ExperienceTheme,
) =>
  Function.pipe(
    loadHomePageEffect(funnelHref, theme),
    Effect.catchTag("ConfigError", () =>
      Effect.gen(function*() {
        const i18n = yield* I18n;
        const shell = yield* loadAppShell(theme);
        return makeFailedHomePageModel(i18n, {
          formValue: "",
          funnelHref,
          shell,
        });
      }),
    ),
  );
