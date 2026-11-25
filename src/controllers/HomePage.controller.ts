import { Config, Effect, Function, Schema } from "effect";
import { makeFilmListViewModel } from "../components/FilmList/FilmList";
import {
  makeFailedHomePageModel,
  makeLoadedHomePageModel,
} from "../components/HomePage/HomePage";
import { makePersonViewModel } from "../components/PersonCard/PersonCard";
import { CharacterId, type Person } from "../domain/FilmUniverse.model";
import { I18n } from "../i18n/I18n.service";
import { PeopleCatalog } from "../services/PeopleCatalog";

const defaultCharacterId = Schema.decodeSync(CharacterId)("1");

export const presentLoadedHomePage = (i18n: I18n, person: Person) => {
  const personViewModel = makePersonViewModel(i18n, person);
  const filmListViewModel = makeFilmListViewModel(
    i18n,
    personViewModel.films,
  );

  return makeLoadedHomePageModel(i18n, {
    formValue: person.id,
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

export const loadHomePageFor = (characterId: CharacterId) =>
  Function.pipe(
    loadHomePageForEffect(characterId),
    Effect.matchEffect({
      onFailure: () =>
        Effect.gen(function*() {
          const i18n = yield* I18n;
          return makeFailedHomePageModel(i18n, { formValue: characterId });
        }),
      onSuccess: (person) =>
        Effect.gen(function*() {
          const i18n = yield* I18n;
          return presentLoadedHomePage(i18n, person);
        }),
    }),
  );

const loadHomePageEffect = Effect.fn("loadHomePage")(function*() {
  const characterIdConfig = Function.pipe(
    Config.schema(CharacterId, "CHARACTER_ID"),
    Config.withDefault(defaultCharacterId),
  );
  const characterId = yield* characterIdConfig;
  return yield* loadHomePageFor(characterId);
});

export const loadHomePage = Function.pipe(
  loadHomePageEffect(),
  Effect.catchTag("ConfigError", () =>
    Effect.gen(function*() {
      const i18n = yield* I18n;
      return makeFailedHomePageModel(i18n, { formValue: "" });
    }),
  ),
);
