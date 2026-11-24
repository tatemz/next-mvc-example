import { Array, Config, Effect, Schema } from "effect";
import { makeFilmListViewModel } from "../components/FilmList/FilmList.factory";
import type { FilmListItemInput } from "../components/FilmListItem/FilmListItem.factory";
import {
  makeFailedHomePageModel,
  makeLoadedHomePageModel,
} from "../components/HomePage/HomePage.factory";
import type { HomePageViewModel } from "../components/HomePage/HomePage.model";
import { makePersonViewModel } from "../components/PersonCard/PersonCard.factory";
import {
  CharacterId,
  type Film,
  type Person,
} from "../domain/StarWars.model";
import { I18n } from "../i18n/I18n.service";
import { StarWarsClient } from "../services/StarWarsClient";

const defaultCharacterId = Schema.decodeSync(CharacterId)("1");

const filmListItem = (film: Film): FilmListItemInput => ({
  title: film.title,
  episodeId: film.episodeId,
});

export const presentLoadedHomePage = (
  i18n: I18n,
  person: Person,
): HomePageViewModel =>
  makeLoadedHomePageModel(i18n, {
    formValue: person.id,
    person: makePersonViewModel(i18n, {
      name: person.name,
      height: person.height,
      mass: person.mass,
    }),
    filmList: makeFilmListViewModel(
      i18n,
      Array.map(person.films, filmListItem),
    ),
  });

export const loadHomePageFor = Effect.fn("loadHomePageFor")(
  function*(characterId: CharacterId) {
    const i18n = yield* I18n;
    const client = yield* StarWarsClient;
    return yield* client.getPerson(characterId).pipe(
      Effect.match({
        onFailure: () =>
          makeFailedHomePageModel(i18n, { formValue: characterId }),
        onSuccess: (person) => presentLoadedHomePage(i18n, person),
      }),
    );
  },
);

export const loadHomePage = Effect.gen(function*() {
  const i18n = yield* I18n;
  return yield* Config.schema(
    CharacterId,
    "STAR_WARS_CHARACTER_ID",
  ).pipe(
    Config.withDefault(defaultCharacterId),
    Effect.matchEffect({
      onFailure: () =>
        Effect.succeed(makeFailedHomePageModel(i18n, { formValue: "" })),
      onSuccess: loadHomePageFor,
    }),
  );
});
