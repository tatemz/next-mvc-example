import { it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { HttpClient, HttpClientResponse, UrlParams } from "effect/http";
import { HttpApiClient } from "effect/http-api";
import { describe, expect } from "vitest";
import { SwapiApi } from "./SwapiApi";
import { makeCharacterId } from "../domain/StarWars.fixture";

const personResponse = {
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  birth_year: "19BBY",
  gender: "male",
  homeworld: "https://swapi.dev/api/planets/1/",
  films: ["https://swapi.dev/api/films/1/"],
  species: [],
  starships: [],
  vehicles: [],
  url: "https://swapi.dev/api/people/1/",
};

const searchResponse = {
  count: 1,
  results: [personResponse],
};

const filmResponse = {
  title: "A New Hope",
  episode_id: 4,
};

const requests: Array<string> = [];
const queries: Array<string> = [];

const httpClient = HttpClient.make((request) => {
  requests.push(request.url);
  queries.push(UrlParams.toString(request.urlParams));
  const body = request.url.endsWith("/people/")
    ? searchResponse
    : request.url.includes("/people/")
      ? personResponse
      : filmResponse;
  return Effect.succeed(
    HttpClientResponse.fromWeb(
      request,
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    ),
  );
});

const httpLayer = Layer.succeed(HttpClient.HttpClient, httpClient);

describe("SwapiApi", () => {
  it.layer(httpLayer)("SwapiApi", (it) => {
    it.effect(
      "fetches a person, a film, and a people search through the generated client",
      () =>
        Effect.gen(function*() {
          const client = yield* HttpApiClient.make(SwapiApi, {
            baseUrl: "https://swapi.dev/api",
          });

          const person = yield* client.people.get({
            params: { id: makeCharacterId("1") },
          });
          const film = yield* client.films.get({ params: { id: 1 } });
          const people = yield* client.people.search({
            query: { search: "luke" },
          });

          expect(person.name).toBe("Luke Skywalker");
          expect(person.birth_year).toBe("19BBY");
          expect(film.title).toBe("A New Hope");
          expect(people.results[0]?.name).toBe("Luke Skywalker");
          expect(requests).toEqual([
            "https://swapi.dev/api/people/1/",
            "https://swapi.dev/api/films/1/",
            "https://swapi.dev/api/people/",
          ]);
          expect(queries).toEqual(["", "", "search=luke"]);
        }),
    );
  });
});
