import { Array, Effect, Function, Option, Schema } from "effect";
import {
  CharacterId,
  Film,
  Person,
  PersonSummary,
  Origin,
  Species,
} from "../domain/FilmUniverse.model";
import type {
  GhibliFilmResponse,
  GhibliPersonResponse,
  GhibliSpeciesResponse,
} from "./GhibliApi";
import { PeopleCatalog, PeopleCatalogError } from "./PeopleCatalog";

export type GhibliSource = {
  readonly people: {
    readonly list: () => Effect.Effect<
      ReadonlyArray<GhibliPersonResponse>,
      unknown
    >;
  };
  readonly films: {
    readonly list: () => Effect.Effect<
      ReadonlyArray<GhibliFilmResponse>,
      unknown
    >;
  };
  readonly species: {
    readonly list: () => Effect.Effect<
      ReadonlyArray<GhibliSpeciesResponse>,
      unknown
    >;
  };
};

const characterId = (index: number) =>
  Schema.decodeSync(CharacterId)(String(index + 1));

export const make = (ghibli: GhibliSource) => {
  const loadPeople = Function.pipe(
    ghibli.people.list(),
    Effect.mapError(
      () =>
        new PeopleCatalogError({
          message: "Characters are not available.",
        }),
    ),
  );

  const loadFilms = Function.pipe(
    ghibli.films.list(),
    Effect.mapError(
      () =>
        new PeopleCatalogError({
          message: "Films are not available.",
        }),
    ),
  );

  const loadSpecies = Function.pipe(
    ghibli.species.list(),
    Effect.mapError(
      () =>
        new PeopleCatalogError({
          message: "Species are not available.",
        }),
    ),
  );

  const getPerson = (id: CharacterId) =>
    Effect.gen(function*() {
      const [people, films, species] = yield* Effect.all(
        [loadPeople, loadFilms, loadSpecies],
        { concurrency: "unbounded" },
      );
      const personOption = Array.get(people, Number(id) - 1);

      if (Option.isNone(personOption)) {
        return yield* Effect.fail(
          new PeopleCatalogError({
            message: `Character ${id} is not available.`,
          }),
        );
      }

      const person = personOption.value;
      const personFilms = Array.flatMap(person.films, (url, index) =>
        Option.match(
          Array.findFirst(films, (candidate) => candidate.url === url),
          {
            onNone: () => [],
            onSome: (film) => [
              Film.make({
                title: film.title,
                order: index + 1,
                imageUrl: film.image,
              }),
            ],
          },
        ),
      );

      const matchedSpecies = person.species === ""
        ? Option.none()
        : Array.findFirst(
          species,
          (candidate) => candidate.url === person.species,
        );

      return yield* Function.pipe(
        personFilms,
        Array.matchLeft({
          onEmpty: () =>
            Effect.fail(
              new PeopleCatalogError({
                message: `Character ${id} has no films.`,
              }),
            ),
          onNonEmpty: (first, rest) =>
            Effect.succeed(
              Person.make({
                id,
                name: person.name,
                height: "unknown",
                mass: "unknown",
                birthYear: "unknown",
                gender: person.gender,
                origin: Origin.make({
                  name: "Ghibli",
                  climate: "unknown",
                  terrain: "unknown",
                }),
                species: Option.match(matchedSpecies, {
                  onNone: () => null,
                  onSome: (matched) =>
                    Species.make({
                      name: matched.name,
                      classification: "unknown",
                      language: "unknown",
                    }),
                }),
                films: [first, ...rest],
                transports: [],
              }),
            ),
        }),
      );
    });

  const searchPeople = (query: string) =>
    Effect.gen(function*() {
      const people = yield* loadPeople;
      const needle = query.trim().toLowerCase();

      return people.flatMap((person, index) =>
        person.name.toLowerCase().includes(needle)
          ? [
              PersonSummary.make({
                id: characterId(index),
                name: person.name,
              }),
            ]
          : [],
      );
    });

  return PeopleCatalog.of({ getPerson, searchPeople });
};
