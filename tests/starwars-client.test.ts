import { it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { HttpClient, HttpClientResponse } from "effect/http";
import { describe, expect } from "vitest";
import { StarWarsClient } from "../src/services/StarWarsClient";

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

const httpClient = HttpClient.make((request) => {
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

const layer = StarWarsClient.layer.pipe(
  Layer.provide(Layer.succeed(HttpClient.HttpClient, httpClient)),
);

describe("StarWarsClient", () => {
  it.effect("decodes a person and their films into a domain object", () =>
    Effect.gen(function*() {
      const person = yield* StarWarsClient.use((client) => client.getPerson(1));

      expect(person).toMatchObject({
        id: 1,
        name: "Luke Skywalker",
        height: "172",
        mass: "77",
      });
      expect(person.films).toHaveLength(1);
      expect(person.films[0]).toEqual({ title: "A New Hope", episodeId: 4 });
    }).pipe(Effect.provide(layer)),
  );
});
