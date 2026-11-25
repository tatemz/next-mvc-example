import { it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { HttpClient, HttpClientResponse } from "effect/http";
import { describe, expect } from "vitest";
import { PeopleCatalog } from "./PeopleCatalog";
import { layer as liveLayer, layerStub } from "./SwapiPeopleCatalog.layer";
import { makeCharacterId, personNamed } from "../domain/FilmUniverse.fixture";

const personResponse = {
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  birth_year: "19BBY",
  gender: "male",
  homeworld: "https://swapi.dev/api/planets/1/",
  films: ["https://swapi.dev/api/films/1/"],
  species: ["https://swapi.dev/api/species/1/"],
  starships: ["https://swapi.dev/api/starships/12/"],
  vehicles: ["https://swapi.dev/api/vehicles/14/"],
  url: "https://swapi.dev/api/people/1/",
};

const filmResponse = {
  title: "A New Hope",
  episode_id: 4,
};

const planetResponse = {
  name: "Tatooine",
  climate: "arid",
  terrain: "desert",
  url: "https://swapi.dev/api/planets/1/",
};

const speciesResponse = {
  name: "Human",
  classification: "mammal",
  language: "Galactic Basic",
  url: "https://swapi.dev/api/species/1/",
};

const starshipResponse = {
  name: "X-wing",
  model: "T-65 X-wing",
  url: "https://swapi.dev/api/starships/12/",
};

const vehicleResponse = {
  name: "Snowspeeder",
  model: "t-47 airspeeder",
  url: "https://swapi.dev/api/vehicles/14/",
};

const searchResponse = {
  count: 1,
  results: [personResponse],
};

const bodyFor = (url: string) => {
  if (url.endsWith("/people/")) return searchResponse;
  if (url.includes("/people/")) return personResponse;
  if (url.includes("/planets/")) return planetResponse;
  if (url.includes("/species/")) return speciesResponse;
  if (url.includes("/starships/")) return starshipResponse;
  if (url.includes("/vehicles/")) return vehicleResponse;
  return filmResponse;
};

const jsonClient = (statusFor = () => 200) =>
  HttpClient.make((request) =>
    Effect.succeed(
      HttpClientResponse.fromWeb(
        request,
        new Response(
          statusFor() === 200 ? JSON.stringify(bodyFor(request.url)) : null,
          {
            status: statusFor(),
            headers: { "content-type": "application/json" },
          },
        ),
      ),
    ),
  );

const layerFor = (statusFor = () => 200) =>
  liveLayer.pipe(
    Layer.provide(Layer.succeed(HttpClient.HttpClient, jsonClient(statusFor))),
  );

const failingStatus =
  (path: string) => (url: string) => (url.includes(path) ? 404 : 200);

const expectResourceError = (
  person: typeof personResponse,
  statusFor: (url: string) => number,
  message: string,
) =>
  Effect.gen(function*() {
    const client = HttpClient.make((request) =>
      Effect.succeed(
        HttpClientResponse.fromWeb(
          request,
          new Response(
            statusFor(request.url) === 200
              ? JSON.stringify(
                  request.url.includes("/people/")
                    ? person
                    : bodyFor(request.url),
                )
              : null,
            {
              status: statusFor(request.url),
              headers: { "content-type": "application/json" },
            },
          ),
        ),
      ),
    );
    const layer = liveLayer.pipe(
      Layer.provide(Layer.succeed(HttpClient.HttpClient, client)),
    );

    const error = yield* PeopleCatalog.use((service) =>
      service.getPerson(makeCharacterId("1")),
    ).pipe(Effect.flip, Effect.provide(layer));

    expect(error).toMatchObject({
      _tag: "PeopleCatalogError",
      message,
    });
  });

describe("PeopleCatalog", () => {
  it.effect("decodes a person dossier into a domain object", () =>
    Effect.gen(function*() {
      const person = yield* PeopleCatalog.use((client) =>
        client.getPerson(makeCharacterId("1")),
      );

      expect(person).toMatchObject({
        _tag: "Person",
        id: "1",
        name: "Luke Skywalker",
        height: "172",
        mass: "77",
        birthYear: "19BBY",
        gender: "male",
        origin: { _tag: "Origin", name: "Tatooine" },
        species: { _tag: "Species", name: "Human" },
      });
      expect(person.films).toHaveLength(1);
      expect(person.films[0]).toEqual({
        _tag: "Film",
        title: "A New Hope",
        order: 4,
      });
      expect(person.transports).toEqual([
        {
          _tag: "Transport",
          key: "starship-12",
          kind: "Starship",
          name: "X-wing",
          model: "T-65 X-wing",
        },
        {
          _tag: "Transport",
          key: "vehicle-14",
          kind: "Vehicle",
          name: "Snowspeeder",
          model: "t-47 airspeeder",
        },
      ]);
    }).pipe(Effect.provide(layerFor())),
  );

  it.effect("handles a person with no species, starships, or vehicles", () => {
    const barePerson = {
      ...personResponse,
      species: [],
      starships: [],
      vehicles: [],
    };
    const client = HttpClient.make((request) =>
      Effect.succeed(
        HttpClientResponse.fromWeb(
          request,
          new Response(
            JSON.stringify(
              request.url.includes("/people/")
                ? barePerson
                : bodyFor(request.url),
            ),
            {
              status: 200,
              headers: { "content-type": "application/json" },
            },
          ),
        ),
      ),
    );
    const layer = liveLayer.pipe(
      Layer.provide(Layer.succeed(HttpClient.HttpClient, client)),
    );

    return Effect.gen(function*() {
      const person = yield* PeopleCatalog.use((service) =>
        service.getPerson(makeCharacterId("1")),
      );

      expect(person.species).toBeNull();
      expect(person.transports).toEqual([]);
    }).pipe(Effect.provide(layer));
  });

  it.effect("searches people by name", () =>
    Effect.gen(function*() {
      const people = yield* PeopleCatalog.use((client) =>
        client.searchPeople("luke"),
      );

      expect(people).toEqual([
        { _tag: "PersonSummary", id: "1", name: "Luke Skywalker" },
      ]);
    }).pipe(Effect.provide(layerFor())),
  );

  it.effect("provides the client built by layerStub", () =>
    Effect.gen(function*() {
      const person = yield* PeopleCatalog.use((client) =>
        client.getPerson(makeCharacterId("3")),
      );
      const people = yield* PeopleCatalog.use((client) =>
        client.searchPeople("stub"),
      );

      expect(person).toEqual(personNamed(makeCharacterId("3"), "Stubbed"));
      expect(people).toEqual([]);
    }).pipe(
      Effect.provide(
        layerStub((id) => Effect.succeed(personNamed(id, "Stubbed"))),
      ),
    ),
  );

  it.effect("maps a person request failure to a PeopleCatalogError", () =>
    expectResourceError(
      personResponse,
      failingStatus("/people/"),
      "Person 1 is not available.",
    ),
  );

  it.effect("maps an origin request failure to a PeopleCatalogError", () =>
    expectResourceError(
      personResponse,
      failingStatus("/planets/"),
      "The origin for person 1 is not available.",
    ),
  );

  it.effect("maps a species request failure to a PeopleCatalogError", () =>
    expectResourceError(
      personResponse,
      failingStatus("/species/"),
      "The species for person 1 is not available.",
    ),
  );

  it.effect("maps a starship request failure to a PeopleCatalogError", () =>
    expectResourceError(
      personResponse,
      failingStatus("/starships/"),
      "The starship for person 1 is not available.",
    ),
  );

  it.effect("maps a vehicle request failure to a PeopleCatalogError", () =>
    expectResourceError(
      personResponse,
      failingStatus("/vehicles/"),
      "The vehicle for person 1 is not available.",
    ),
  );

  it.effect("maps a film request failure to a PeopleCatalogError", () =>
    expectResourceError(
      personResponse,
      failingStatus("/films/"),
      "The film for person 1 is not available.",
    ),
  );

  it.effect("maps a search request failure to a PeopleCatalogError", () => {
    const client = HttpClient.make((request) =>
      Effect.succeed(
        HttpClientResponse.fromWeb(
          request,
          new Response(null, { status: 503 }),
        ),
      ),
    );
    const layer = liveLayer.pipe(
      Layer.provide(Layer.succeed(HttpClient.HttpClient, client)),
    );

    return Effect.gen(function*() {
      const error = yield* PeopleCatalog.use((service) =>
        service.searchPeople("luke"),
      ).pipe(Effect.flip);

      expect(error).toMatchObject({
        _tag: "PeopleCatalogError",
        message: "Characters matching luke are not available.",
      });
    }).pipe(Effect.provide(layer));
  });

  it.effect("maps an invalid origin URL to a PeopleCatalogError", () =>
    expectResourceError(
      { ...personResponse, homeworld: "not-a-url" },
      () => 200,
      "The origin for person 1 is not available.",
    ),
  );

  it.effect("maps a species URL without an id to a PeopleCatalogError", () =>
    expectResourceError(
      { ...personResponse, species: ["https://swapi.dev/"] },
      () => 200,
      "The species for person 1 is not available.",
    ),
  );

  it.effect("maps a starship URL without an id to a PeopleCatalogError", () =>
    expectResourceError(
      { ...personResponse, starships: ["https://swapi.dev/"] },
      () => 200,
      "The starship for person 1 is not available.",
    ),
  );

  it.effect("maps a vehicle URL without an id to a PeopleCatalogError", () =>
    expectResourceError(
      { ...personResponse, vehicles: ["https://swapi.dev/"] },
      () => 200,
      "The vehicle for person 1 is not available.",
    ),
  );

  it.effect("maps an invalid film URL to a PeopleCatalogError", () =>
    expectResourceError(
      { ...personResponse, films: ["not-a-url"] },
      () => 200,
      "The film for person 1 is not available.",
    ),
  );

  it.effect("maps a search result without an id to a PeopleCatalogError", () => {
    const client = HttpClient.make((request) =>
      Effect.succeed(
        HttpClientResponse.fromWeb(
          request,
          new Response(
            JSON.stringify({
              count: 1,
              results: [
                {
                  ...personResponse,
                  url: "https://swapi.dev/",
                },
              ],
            }),
            {
              status: 200,
              headers: { "content-type": "application/json" },
            },
          ),
        ),
      ),
    );
    const layer = liveLayer.pipe(
      Layer.provide(Layer.succeed(HttpClient.HttpClient, client)),
    );

    return Effect.gen(function*() {
      const error = yield* PeopleCatalog.use((service) =>
        service.searchPeople("luke"),
      ).pipe(Effect.flip);

      expect(error).toMatchObject({
        _tag: "PeopleCatalogError",
        message: "Character Luke Skywalker has no id.",
      });
    }).pipe(Effect.provide(layer));
  });
});
