import { it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { HttpClient, HttpClientResponse } from "effect/http";
import { describe, expect } from "vitest";
import { StarWarsClient } from "./StarWarsClient";
import {
  layer as liveLayer,
  layerStub,
} from "./StarWarsClient.layer";
import { makeCharacterId, personNamed } from "../domain/StarWars.fixture";

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

const expectFilmErrorFor = (films: ReadonlyArray<string>) =>
  Effect.gen(function*() {
    const client = HttpClient.make((request) =>
      request.url.includes("/people/")
        ? Effect.succeed(
            HttpClientResponse.fromWeb(
              request,
              new Response(JSON.stringify({ ...personResponse, films }), {
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
    const layer = liveLayer.pipe(
      Layer.provide(Layer.succeed(HttpClient.HttpClient, client)),
    );

    const error = yield* StarWarsClient.use((service) =>
      service.getPerson(makeCharacterId("1")),
    ).pipe(Effect.flip, Effect.provide(layer));

    expect(error).toMatchObject({
      _tag: "StarWarsError",
      message: "A film for person 1 is not available.",
    });
  });

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

  it.effect("maps an invalid film URL to a StarWarsError", () =>
    expectFilmErrorFor(["not-a-url"]),
  );

  it.effect("maps a film URL without an id to a StarWarsError", () =>
    expectFilmErrorFor(["https://swapi.dev/"]),
  );

  it.effect("maps a non-numeric film id to a StarWarsError", () =>
    expectFilmErrorFor(["https://swapi.dev/api/films/not-a-number/"]),
  );
});
