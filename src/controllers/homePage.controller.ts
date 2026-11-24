import { Config, Effect } from "effect";
import {
  makeFailedHomePageModel,
  makeLoadedHomePageModel,
} from "../components/HomePage/factory";
import type { HomePageViewModel } from "../components/HomePage/model";
import { StarWarsClient } from "../services/StarWarsClient";

export const loadHomePageFor = (
  characterId: number,
): Effect.Effect<HomePageViewModel, never, StarWarsClient> =>
  Effect.gen(function*() {
    const client = yield* StarWarsClient;
    const person = yield* client.getPerson(characterId);
    return makeLoadedHomePageModel(person);
  }).pipe(
    Effect.catchTag("StarWarsError", (error) =>
      Effect.succeed(
        makeFailedHomePageModel({
          form: { characterId: String(characterId) },
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
  const characterId = yield* Config.Int("STAR_WARS_CHARACTER_ID").pipe(
    Config.withDefault(1),
  );
  return yield* loadHomePageFor(characterId);
}).pipe(
  Effect.catchTag("ConfigError", (error) =>
    Effect.succeed(
      makeFailedHomePageModel({
        form: { characterId: "" },
        message: error.message,
      }),
    ),
  ),
);
