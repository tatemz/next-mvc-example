import { Config, Effect, Function, Layer, String as Str } from "effect";
import { HttpApiClient } from "effect/http-api";
import { GhibliApi } from "./GhibliApi";
import { PeopleCatalog, PeopleCatalogError } from "./PeopleCatalog";
import { make } from "./GhibliPeopleCatalog.factory";

const apiUrl = Config.String("GHIBLI_API_URL");

export const layer = Layer.effect(
  PeopleCatalog,
  Effect.gen(function*() {
    const configuredBaseUrl = yield* apiUrl;
    const baseUrl = Function.pipe(
      configuredBaseUrl,
      Str.replace(/\/$/, ""),
    );
    const ghibli = yield* HttpApiClient.make(GhibliApi, { baseUrl });
    return make({
      people: {
        list: () =>
          ghibli.people.list().pipe(
            Effect.mapError(
              () =>
                new PeopleCatalogError({
                  message: "Characters are not available.",
                }),
            ),
          ),
      },
      films: {
        list: () =>
          ghibli.films.list().pipe(
            Effect.mapError(
              () =>
                new PeopleCatalogError({
                  message: "Films are not available.",
                }),
            ),
          ),
      },
      species: {
        list: () =>
          ghibli.species.list().pipe(
            Effect.mapError(
              () =>
                new PeopleCatalogError({
                  message: "Species are not available.",
                }),
            ),
          ),
      },
    });
  }),
);
