import { it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { HttpClient, HttpClientResponse } from "effect/http";
import { describe, expect } from "vitest";
import { StarWarsClient } from "../src/services/StarWarsClient";
import {
  layer as liveLayer,
  layerStub,
} from "../src/services/StarWarsClient.layer";
import { makeCharacterId, personNamed } from "./fixtures/Person.fixture";

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

const layer = liveLayer.pipe(
  Layer.provide(Layer.succeed(HttpClient.HttpClient, httpClient)),
);

describe("StarWarsClient", () => {
  it.effect("decodes a person and their films into a domain object", () =>
    Effect.gen(function*() {
      const person = yield* StarWarsClient.use((client) =>
        client.getPerson(makeCharacterId("1")),
      );

      expect(person).toMatchObject({
        _tag: "Person",
        id: "1",
        name: "Luke Skywalker",
        height: "172",
        mass: "77",
      });
      expect(person.films).toHaveLength(1);
      expect(person.films[0]).toEqual({
        _tag: "Film",
        title: "A New Hope",
        episodeId: 4,
      });
    }).pipe(Effect.provide(layer)),
  );

  it.effect("provides the client built by layerStub", () =>
    Effect.gen(function*() {
      const person = yield* StarWarsClient.use((client) =>
        client.getPerson(makeCharacterId("3")),
      );

      expect(person).toEqual(personNamed(makeCharacterId("3"), "Stubbed"));
    }).pipe(
      Effect.provide(
        layerStub((id) => Effect.succeed(personNamed(id, "Stubbed"))),
      ),
    ),
  );

  it.effect("maps a person request failure to a StarWarsError", () => {
    const failingClient = HttpClient.make((request) =>
      Effect.succeed(
        HttpClientResponse.fromWeb(request, new Response(null, { status: 404 })),
      ),
    );
    const failingLayer = liveLayer.pipe(
      Layer.provide(Layer.succeed(HttpClient.HttpClient, failingClient)),
    );

    return Effect.gen(function*() {
      const error = yield* StarWarsClient.use((client) =>
        client.getPerson(makeCharacterId("1")),
      ).pipe(Effect.flip);

      expect(error).toMatchObject({
        _tag: "StarWarsError",
        message: "Person 1 is not available.",
      });
    }).pipe(Effect.provide(failingLayer));
  });

  it.effect("fetches every film a person has", () => {
    const twoFilmsResponse = {
      ...personResponse,
      films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/2/",
      ],
    };
    const twoFilmClient = HttpClient.make((request) => {
      const episodeId = request.url.includes("/films/2/") ? 2 : 1;
      const body = request.url.includes("/people/")
        ? twoFilmsResponse
        : { title: `Film ${episodeId}`, episode_id: episodeId };
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
    const twoFilmLayer = liveLayer.pipe(
      Layer.provide(Layer.succeed(HttpClient.HttpClient, twoFilmClient)),
    );

    return Effect.gen(function*() {
      const person = yield* StarWarsClient.use((client) =>
        client.getPerson(makeCharacterId("1")),
      );

      expect(person.films.map((film) => film.episodeId)).toEqual([1, 2]);
    }).pipe(Effect.provide(twoFilmLayer));
  });

  it.effect("maps a film request failure to a StarWarsError", () => {
    const failingClient = HttpClient.make((request) =>
      request.url.includes("/people/")
        ? Effect.succeed(
            HttpClientResponse.fromWeb(
              request,
              new Response(JSON.stringify(personResponse), {
                status: 200,
                headers: { "content-type": "application/json" },
              }),
            ),
          )
        : Effect.succeed(
            HttpClientResponse.fromWeb(
              request,
              new Response(null, { status: 404 }),
            ),
          ),
    );
    const failingLayer = liveLayer.pipe(
      Layer.provide(Layer.succeed(HttpClient.HttpClient, failingClient)),
    );

    return Effect.gen(function*() {
      const error = yield* StarWarsClient.use((client) =>
        client.getPerson(makeCharacterId("1")),
      ).pipe(Effect.flip);

      expect(error).toMatchObject({
        _tag: "StarWarsError",
        message: "A film for person 1 is not available.",
      });
    }).pipe(Effect.provide(failingLayer));
  });

  it.effect("maps a malformed film reference to a StarWarsError", () => {
    const malformedPerson = {
      ...personResponse,
      films: ["not-a-url"],
    };
    const malformedClient = HttpClient.make((request) =>
      request.url.includes("/people/")
        ? Effect.succeed(
            HttpClientResponse.fromWeb(
              request,
              new Response(JSON.stringify(malformedPerson), {
                status: 200,
                headers: { "content-type": "application/json" },
              }),
            ),
          )
        : Effect.succeed(
            HttpClientResponse.fromWeb(
              request,
              new Response(null, { status: 404 }),
            ),
          ),
    );
    const malformedLayer = liveLayer.pipe(
      Layer.provide(Layer.succeed(HttpClient.HttpClient, malformedClient)),
    );

    return Effect.gen(function*() {
      const error = yield* StarWarsClient.use((client) =>
        client.getPerson(makeCharacterId("1")),
      ).pipe(Effect.flip);

      expect(error).toMatchObject({
        _tag: "StarWarsError",
        message: "A film for person 1 is not available.",
      });
    }).pipe(Effect.provide(malformedLayer));
  });
});
