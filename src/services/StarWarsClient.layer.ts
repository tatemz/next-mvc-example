import { Config, Effect, Layer } from "effect";
import { HttpClient } from "effect/http";
import { HttpApiClient } from "effect/http-api";
import { SwapiApi } from "./SwapiApi";
import { StarWarsClient } from "./StarWarsClient";
import { make, makeStub } from "./StarWarsClient.factory";

const apiUrl = Config.String("STAR_WARS_API_URL").pipe(
  Config.withDefault("https://swapi.dev/api"),
);

export const layer: Layer.Layer<
  StarWarsClient,
  Config.ConfigError,
  HttpClient.HttpClient
> = Layer.effect(
  StarWarsClient,
  Effect.gen(function*() {
    const baseUrl = (yield* apiUrl).replace(/\/$/, "");
    const swapi = yield* HttpApiClient.make(SwapiApi, { baseUrl });
    return make(swapi);
  }),
);

export const layerStub = (
  getPerson: StarWarsClient["getPerson"],
): Layer.Layer<StarWarsClient> =>
  Layer.succeed(StarWarsClient, makeStub(getPerson));
