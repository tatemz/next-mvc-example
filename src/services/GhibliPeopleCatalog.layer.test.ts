import { it } from "@effect/vitest";
import { ConfigProvider, Effect, Layer } from "effect";
import { HttpClient, HttpClientResponse } from "effect/http";
import { describe, expect } from "vitest";
import { makeCharacterId } from "../domain/FilmUniverse.fixture";
import { layer } from "./GhibliPeopleCatalog.layer";
import { PeopleCatalog } from "./PeopleCatalog";

const people = [
  {
    name: "Haku",
    gender: "Male",
    films: ["https://ghibliapi.vercel.app/films/spirited-away"],
    species: "https://ghibliapi.vercel.app/species/dragon",
  },
];

const films = [
  {
    title: "Spirited Away",
    image: "https://example.com/spirited-away.jpg",
    url: "https://ghibliapi.vercel.app/films/spirited-away",
  },
];

const species = [
  { name: "Dragon", url: "https://ghibliapi.vercel.app/species/dragon" },
];

const bodyFor = (url: string) => {
  if (url.includes("/people")) return people;
  if (url.includes("/films")) return films;
  return species;
};

const httpClientFor = (statusFor: (url: string) => number) =>
  HttpClient.make((request) => {
    const status = statusFor(request.url);
    const body = status === 200 ? JSON.stringify(bodyFor(request.url)) : "";
    return Effect.succeed(
      HttpClientResponse.fromWeb(
        request,
        new Response(body, {
          status,
          headers:
            status === 200
              ? { "content-type": "application/json" }
              : undefined,
        }),
      ),
    );
  });

const layerFor = (statusFor: (url: string) => number) =>
  layer.pipe(
    Layer.provide(
      Layer.succeed(HttpClient.HttpClient, httpClientFor(statusFor)),
    ),
    Layer.provide(
      Layer.succeed(
        ConfigProvider.ConfigProvider,
        ConfigProvider.fromEnv({
          env: { GHIBLI_API_URL: "https://ghibliapi.vercel.app" },
        }),
      ),
    ),
  );

const testLayer = layerFor(() => 200);

const failureCase = (path: string, message: string) =>
  it.effect(`maps a ${path} request failure to a catalog error`, () =>
    Effect.gen(function*() {
      const error = yield* PeopleCatalog.use((catalog) =>
        catalog.getPerson(makeCharacterId("1")),
      ).pipe(
        Effect.provide(
          layerFor((url) => (url.includes(path) ? 500 : 200)),
        ),
        Effect.flip,
      );

      expect(error).toMatchObject({
        _tag: "PeopleCatalogError",
        message,
      });
    }),
  );

describe("GhibliPeopleCatalog layer", () => {
  failureCase("/people", "Characters are not available.");
  failureCase("/films", "Films are not available.");
  failureCase("/species", "Species are not available.");

  it.effect("builds the catalog over the typed Ghibli API", () =>
    Effect.gen(function*() {
      const person = yield* PeopleCatalog.use((catalog) =>
        catalog.getPerson(makeCharacterId("1")),
      ).pipe(Effect.provide(testLayer));

      expect(person).toMatchObject({
        name: "Haku",
        species: { name: "Dragon" },
      });
      expect(person.films).toEqual([
        {
          _tag: "Film",
          title: "Spirited Away",
          order: 1,
          imageUrl: "https://example.com/spirited-away.jpg",
        },
      ]);
    }),
  );
});
