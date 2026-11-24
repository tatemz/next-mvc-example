import { Config, Effect, Function, Layer, String as Str } from "effect";
import { HttpApiClient } from "effect/http-api";
import { SwapiApi } from "./SwapiApi";
import { StarWarsClient } from "./StarWarsClient";
import { make, makeStub } from "./StarWarsClient.factory";

const apiUrl = Function.pipe(
  Config.String("STAR_WARS_API_URL"),
  Config.withDefault("https://swapi.dev/api"),
);

export const layer = Layer.effect(
  StarWarsClient,
  Effect.gen(function*() {
    const configuredBaseUrl = yield* apiUrl;
    const baseUrl = Function.pipe(
      configuredBaseUrl,
      Str.replace(/\/$/, ""),
    );
    const swapi = yield* HttpApiClient.make(SwapiApi, { baseUrl });
    return make(swapi);
  }),
);

export const layerStub = (getPerson: StarWarsClient["getPerson"]) =>
  Layer.succeed(StarWarsClient, makeStub(getPerson));
