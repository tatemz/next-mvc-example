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
  makeInitialSearchFormViewModel,
  makeRetrySearchFormViewModel,
} from "../components/SearchForm/SearchForm.factory";
import {
  CharacterId,
  type Film,
  type Person,
} from "../domain/StarWars.model";
import { StarWarsClient } from "../services/StarWarsClient";

const defaultCharacterId = Schema.decodeSync(CharacterId)("1");

const filmListItem = (film: Film): FilmListItemInput => ({
  title: film.title,
  episodeId: film.episodeId,
});

export const presentLoadedHomePage = (person: Person): HomePageViewModel =>
  makeLoadedHomePageModel({
    form: makeInitialSearchFormViewModel(person.id),
    person: makePersonViewModel({
      name: person.name,
      height: person.height,
      mass: person.mass,
    }),
    filmList: makeFilmListViewModel(Array.map(person.films, filmListItem)),
  });

export const loadHomePageFor = (
  characterId: CharacterId,
): Effect.Effect<HomePageViewModel, never, StarWarsClient> =>
  Effect.gen(function*() {
    const client = yield* StarWarsClient;
    const person = yield* client.getPerson(characterId);
    return presentLoadedHomePage(person);
  }).pipe(
    Effect.catchTag("StarWarsError", (error) =>
      Effect.succeed(
        makeFailedHomePageModel({
          form: makeRetrySearchFormViewModel(characterId),
          message: error.message,
        }),
      ),
    ),
  );

export const loadHomePage: Effect.Effect<
  HomePageViewModel,
  never,
  StarWarsClient
> = Effect.gen(function*() {
  const characterId = yield* Config.schema(
    CharacterId,
    "STAR_WARS_CHARACTER_ID",
  ).pipe(
    Config.withDefault(defaultCharacterId),
  );
  return yield* loadHomePageFor(characterId);
}).pipe(
  Effect.catchTag("ConfigError", (error) =>
    Effect.succeed(
      makeFailedHomePageModel({
        form: makeRetrySearchFormViewModel(""),
        message: error.message,
      }),
    ),
  ),
);
