import { Config, Effect, Schema } from "effect";
import { CharacterId } from "../domain/CharacterId.model";
import { makeFailedHomePageModel } from "../components/HomePage/HomePage.factory";
import type { HomePageViewModel } from "../components/HomePage/HomePage.model";
import { presentLoadedHomePage } from "../components/HomePage/HomePage.presenter";
import { StarWarsClient } from "../services/StarWarsClient";

const defaultCharacterId = Schema.decodeSync(CharacterId)("1");

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
          characterId,
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
        characterId: "",
        message: error.message,
      }),
    ),
  ),
);
