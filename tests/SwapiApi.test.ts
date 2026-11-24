import { it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { HttpClient, HttpClientResponse } from "effect/http";
import { HttpApiClient } from "effect/http-api";
import { describe, expect } from "vitest";
import { SwapiApi } from "../src/services/SwapiApi";
import { makeCharacterId } from "./fixtures/Person.fixture";

const personResponse = {
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  films: ["https://swapi.dev/api/films/1/"],
};

const filmResponse = {
  title: "A New Hope",
  episode_id: 4,
};

const requests: Array<string> = [];

const httpClient = HttpClient.make((request) => {
  requests.push(request.url);
  const body = request.url.includes("/people/") ? personResponse : filmResponse;
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
    it.effect("fetches a person and a film through the generated client", () =>
      Effect.gen(function*() {
        const client = yield* HttpApiClient.make(SwapiApi, {
          baseUrl: "https://swapi.dev/api",
        });

        const person = yield* client.people.get({
          params: { id: makeCharacterId("1") },
        });
        const film = yield* client.films.get({ params: { id: 1 } });

        expect(person.name).toBe("Luke Skywalker");
        expect(film.title).toBe("A New Hope");
        expect(requests).toEqual([
          "https://swapi.dev/api/people/1/",
          "https://swapi.dev/api/films/1/",
        ]);
      }),
    );
  });
});
