import { TransportKinds } from "../domain/FilmUniverse.model";
import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import { makeCharacterId } from "../domain/FilmUniverse.fixture";
import type {
  GhibliFilmResponse,
  GhibliPersonResponse,
  GhibliSpeciesResponse,
  GhibliVehicleResponse,
} from "./GhibliApi";
import { make, type GhibliSource } from "./GhibliPeopleCatalog.factory";
import { PeopleCatalogError } from "./PeopleCatalog";

const hakuUrl = "https://ghibliapi.vercel.app/people/haku";

const people: ReadonlyArray<GhibliPersonResponse> = [
  {
    name: "Haku",
    gender: "Male",
    films: ["https://ghibliapi.vercel.app/films/spirited-away"],
    species: "https://ghibliapi.vercel.app/species/dragon",
    url: hakuUrl,
  },
  {
    name: "Pazu",
    gender: "Male",
    films: ["https://ghibliapi.vercel.app/films/castle-in-the-sky"],
    species: "https://ghibliapi.vercel.app/species/human",
    url: "https://ghibliapi.vercel.app/people/pazu",
  },
];

const films: ReadonlyArray<GhibliFilmResponse> = [
  {
    title: "Spirited Away",
    image: "https://example.com/spirited-away.jpg",
    url: "https://ghibliapi.vercel.app/films/spirited-away",
  },
  {
    title: "Castle in the Sky",
    image: "https://example.com/castle-in-the-sky.jpg",
    url: "https://ghibliapi.vercel.app/films/castle-in-the-sky",
  },
];

const species: ReadonlyArray<GhibliSpeciesResponse> = [
  { name: "Dragon", url: "https://ghibliapi.vercel.app/species/dragon" },
  { name: "Human", url: "https://ghibliapi.vercel.app/species/human" },
];

const hakuVehicle: GhibliVehicleResponse = {
  id: "red-wing",
  name: "Red Wing",
  description: "An experimental aircraft.",
  vehicle_class: "Airplane",
  length: "20",
  pilot: hakuUrl,
  films: ["https://ghibliapi.vercel.app/films/spirited-away"],
  url: "https://ghibliapi.vercel.app/vehicles/red-wing",
};

const source = (overrides: Partial<GhibliSource> = {}): GhibliSource => ({
  people: { list: () => Effect.succeed(people) },
  films: { list: () => Effect.succeed(films) },
  species: { list: () => Effect.succeed(species) },
  vehicles: { list: () => Effect.succeed([]) },
  ...overrides,
});

const id = (value: string) => makeCharacterId(value);

describe("GhibliPeopleCatalog", () => {
  it.effect("maps a person into the shared domain", () =>
    Effect.gen(function*() {
      const person = yield* make(source()).getPerson(id("1"));

      expect(person).toMatchObject({
        _tag: "Person",
        id: "1",
        name: "Haku",
        height: "unknown",
        mass: "unknown",
        birthYear: "unknown",
        gender: "Male",
        origin: { _tag: "Origin", name: "Ghibli" },
        species: { _tag: "Species", name: "Dragon" },
        transports: [],
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

  it.effect("searches people by name with their array ids", () =>
    Effect.gen(function*() {
      const client = make(source());

      expect(yield* client.searchPeople("hak")).toEqual([
        { _tag: "PersonSummary", id: "1", name: "Haku" },
      ]);
      expect(yield* client.searchPeople("  pazu  ")).toEqual([
        { _tag: "PersonSummary", id: "2", name: "Pazu" },
      ]);
      expect(yield* client.searchPeople("nobody")).toEqual([]);
    }),
  );

  it.effect("maps a missing person to a catalog error", () =>
    Effect.gen(function*() {
      const error = yield* Effect.flip(make(source()).getPerson(id("9")));

      expect(error).toMatchObject({
        _tag: "PeopleCatalogError",
        message: "Character 9 is not available.",
      });
    }),
  );

  it.effect("maps a person with no films to a catalog error", () =>
    Effect.gen(function*() {
      const error = yield* Effect.flip(
        make(
          source({
            people: {
              list: () =>
                Effect.succeed([
                  { ...people[0]!, films: [] },
                ]),
            },
          }),
        ).getPerson(id("1")),
      );

      expect(error).toMatchObject({
        message: "Character 1 has no films.",
      });
    }),
  );

  it.effect("maps a missing film reference to a catalog error", () =>
    Effect.gen(function*() {
      const error = yield* Effect.flip(
        make(
          source({
            people: {
              list: () =>
                Effect.succeed([
                  {
                    ...people[0]!,
                    films: ["https://ghibliapi.vercel.app/films/missing"],
                  },
                ]),
            },
          }),
        ).getPerson(id("1")),
      );

      expect(error).toMatchObject({
        message: "Character 1 has no films.",
      });
    }),
  );

  it.effect("leaves species null when the person has no species reference", () =>
    Effect.gen(function*() {
      const person = yield* make(
        source({
          people: {
            list: () =>
              Effect.succeed([
                {
                  ...people[0]!,
                  species: "",
                },
              ]),
          },
        }),
      ).getPerson(id("1"));

      expect(person.species).toBeNull();
    }),
  );

  it.effect("leaves species null when the reference is missing", () =>
    Effect.gen(function*() {
      const person = yield* make(
        source({
          people: {
            list: () =>
              Effect.succeed([
                {
                  ...people[0]!,
                  species: "https://ghibliapi.vercel.app/species/missing",
                },
              ]),
          },
        }),
      ).getPerson(id("1"));

      expect(person.species).toBeNull();
    }),
  );

  it.effect("maps a piloted vehicle to a transport", () =>
    Effect.gen(function*() {
      const person = yield* make(
        source({ vehicles: { list: () => Effect.succeed([hakuVehicle]) } }),
      ).getPerson(id("1"));

      expect(person.transports).toEqual([
        {
          _tag: "Transport",
          key: "red-wing",
          kind: TransportKinds.Vehicle,
          name: "Red Wing",
          model: "Airplane",
        },
      ]);
    }),
  );

  it.effect("ignores a vehicle piloted by another character", () =>
    Effect.gen(function*() {
      const person = yield* make(
        source({
          vehicles: {
            list: () =>
              Effect.succeed([
                {
                  ...hakuVehicle,
                  pilot: "https://ghibliapi.vercel.app/people/pazu",
                },
              ]),
          },
        }),
      ).getPerson(id("1"));

      expect(person.transports).toEqual([]);
    }),
  );

  it.effect("maps a people request failure to a catalog error", () =>
    Effect.gen(function*() {
      const error = yield* Effect.flip(
        make(
          source({ people: { list: () => Effect.fail(new PeopleCatalogError({ message: "offline" })) } }),
        ).getPerson(id("1")),
      );

      expect(error).toMatchObject({
        message: "Characters are not available.",
      });
    }),
  );

  it.effect("maps a films request failure to a catalog error", () =>
    Effect.gen(function*() {
      const error = yield* Effect.flip(
        make(
          source({ films: { list: () => Effect.fail(new PeopleCatalogError({ message: "offline" })) } }),
        ).getPerson(id("1")),
      );

      expect(error).toMatchObject({
        message: "Films are not available.",
      });
    }),
  );

  it.effect("maps a species request failure to a catalog error", () =>
    Effect.gen(function*() {
      const error = yield* Effect.flip(
        make(
          source({ species: { list: () => Effect.fail(new PeopleCatalogError({ message: "offline" })) } }),
        ).getPerson(id("1")),
      );

      expect(error).toMatchObject({
        message: "Species are not available.",
      });
    }),
  );

  it.effect("maps a vehicles request failure to a catalog error", () =>
    Effect.gen(function*() {
      const error = yield* Effect.flip(
        make(
          source({
            vehicles: {
              list: () =>
                Effect.fail(
                  new PeopleCatalogError({ message: "offline" }),
                ),
            },
          }),
        ).getPerson(id("1")),
      );

      expect(error).toMatchObject({
        message: "Vehicles are not available.",
      });
    }),
  );

  it.effect("maps a search request failure to a catalog error", () =>
    Effect.gen(function*() {
      const error = yield* Effect.flip(
        make(source({ people: { list: () => Effect.fail(new PeopleCatalogError({ message: "offline" })) } })).searchPeople(
          "hak",
        ),
      );

      expect(error).toMatchObject({
        message: "Characters are not available.",
      });
    }),
  );
});
