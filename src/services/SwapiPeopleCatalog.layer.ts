import { Config, Effect, Function, Layer, String as Str } from "effect";
import { HttpApiClient } from "effect/http-api";
import { SwapiApi } from "./SwapiApi";
import { PeopleCatalog } from "./PeopleCatalog";
import { make, makeStub } from "./SwapiPeopleCatalog.factory";

const apiUrl = Function.pipe(
  Config.String("STAR_WARS_API_URL"),
  Config.withDefault("https://swapi.dev/api"),
);

export const layer = Layer.effect(
  PeopleCatalog,
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

export const layerStub = (
  getPerson: PeopleCatalog["getPerson"],
  searchPeople?: PeopleCatalog["searchPeople"],
) => Layer.succeed(PeopleCatalog, makeStub(getPerson, searchPeople));
