import { it } from "@effect/vitest";
import { Effect, Layer } from "effect";
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

const httpClient = HttpClient.make((request) =>
  Effect.succeed(
    HttpClientResponse.fromWeb(
      request,
      new Response(JSON.stringify(bodyFor(request.url)), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    ),
  ),
);

const testLayer = layer.pipe(
  Layer.provide(Layer.succeed(HttpClient.HttpClient, httpClient)),
);

describe("GhibliPeopleCatalog layer", () => {
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
