import {
  Array,
  Effect,
  Function,
  Number as Num,
  Option,
  Result,
  Schema,
  String as Str,
} from "effect";
import { Url } from "effect/http";
import {
  CharacterId,
  Film,
  Person,
  PersonSummary,
  Origin,
  Species,
  Transport,
} from "../domain/FilmUniverse.model";
import type {
  SwapiFilmResponse,
  SwapiPersonResponse,
  SwapiApiClient,
} from "./SwapiApi";
import { PeopleCatalog, PeopleCatalogError } from "./PeopleCatalog";

const idFromPath = Function.flow(
  Str.split("/"),
  Array.filter(Str.isNonEmpty),
  Array.last,
  Option.flatMap(Num.parse),
);

const idFromUrl = Function.flow(
  (url: string) => Url.fromString(url),
  Result.match({
    onFailure: () => Option.none<number>(),
    onSuccess: ({ pathname }) => idFromPath(pathname),
  }),
);

const unavailable = (kind: string, personId: CharacterId) =>
  new PeopleCatalogError({
    message: `The ${kind} for person ${personId} is not available.`,
  });

const resourceId = (kind: string, personId: CharacterId) => (url: string) =>
  Function.pipe(
    idFromUrl(url),
    Option.match({
      onNone: () => Effect.fail(unavailable(kind, personId)),
      onSome: Effect.succeed,
    }),
  );

const toFilm = (film: SwapiFilmResponse) =>
  Film.make({
    title: film.title,
    order: film.episode_id,
  });

export const make = (swapi: SwapiApiClient) => {
  const getFilms = (urls: SwapiPersonResponse["films"], id: CharacterId) =>
    Effect.forEach(
      urls,
      (url) =>
        Effect.gen(function*() {
          const filmId = yield* resourceId("film", id)(url);
          const film = yield* Function.pipe(
            swapi.films.get({ params: { id: filmId } }),
            Effect.mapError(() => unavailable("film", id)),
          );
          return toFilm(film);
        }),
      { concurrency: "unbounded" },
    );

  const getOrigin = (url: string, id: CharacterId) =>
    Effect.gen(function*() {
      const planetId = yield* resourceId("origin", id)(url);
      const planet = yield* Function.pipe(
        swapi.planets.get({ params: { id: planetId } }),
        Effect.mapError(() => unavailable("origin", id)),
      );
      return Origin.make({
        name: planet.name,
        climate: planet.climate,
        terrain: planet.terrain,
      });
    });

  const getSpecies = (urls: SwapiPersonResponse["species"], id: CharacterId) =>
    Function.pipe(
      urls,
      Array.head,
      Option.match({
        onNone: () => Effect.succeed<Species | null>(null),
        onSome: (url) =>
          Effect.gen(function*() {
            const speciesId = yield* resourceId("species", id)(url);
            const species = yield* Function.pipe(
              swapi.species.get({ params: { id: speciesId } }),
              Effect.mapError(() => unavailable("species", id)),
            );
            return Species.make({
              name: species.name,
              classification: species.classification,
              language: species.language,
            });
          }),
      }),
    );

  const getTransport = (
    kind: "Starship" | "Vehicle",
    url: string,
    id: CharacterId,
  ) =>
    Effect.gen(function*() {
      const transportId = yield* resourceId(kind.toLowerCase(), id)(url);
      const response = yield* Function.pipe(
        kind === "Starship"
          ? swapi.starships.get({ params: { id: transportId } })
          : swapi.vehicles.get({ params: { id: transportId } }),
        Effect.mapError(() => unavailable(kind.toLowerCase(), id)),
      );
      return Transport.make({
        key: `${kind === "Starship" ? "starship" : "vehicle"}-${transportId}`,
        kind,
        name: response.name,
        model: response.model,
      });
    });

  const getTransports = (person: SwapiPersonResponse, id: CharacterId) =>
    Effect.all(
      [
        ...Array.map(person.starships, (url) =>
          getTransport("Starship", url, id),
        ),
        ...Array.map(person.vehicles, (url) => getTransport("Vehicle", url, id)),
      ],
      { concurrency: "unbounded" },
    );

  const getPerson = Effect.fn("PeopleCatalog.getPerson")(
    function*(id: CharacterId) {
      const person = yield* Function.pipe(
        swapi.people.get({ params: { id } }),
        Effect.mapError(
          () =>
            new PeopleCatalogError({
              message: `Person ${id} is not available.`,
            }),
        ),
      );

      const [origin, species, films, transports] = yield* Effect.all(
        [
          getOrigin(person.homeworld, id),
          getSpecies(person.species, id),
          getFilms(person.films, id),
          getTransports(person, id),
        ],
        { concurrency: "unbounded" },
      );

      return Person.make({
        id,
        name: person.name,
        height: person.height,
        mass: person.mass,
        birthYear: person.birth_year,
        gender: person.gender,
        origin,
        species,
        films,
        transports,
      });
    },
  );

  const searchPeople = (query: string) =>
    Effect.gen(function*() {
      const response = yield* Function.pipe(
        swapi.people.search({ query: { search: query } }),
        Effect.mapError(
          () =>
            new PeopleCatalogError({
              message: `Characters matching ${query} are not available.`,
            }),
        ),
      );

      return yield* Effect.forEach(
        response.results,
        (person) =>
          Effect.gen(function*() {
            const personId = yield* Function.pipe(
              idFromUrl(person.url),
              Option.match({
                onNone: () =>
                  Effect.fail(
                    new PeopleCatalogError({
                      message: `Character ${person.name} has no id.`,
                    }),
                  ),
                onSome: (value) =>
                  Effect.succeed(
                    Schema.decodeSync(CharacterId)(String(value)),
                  ),
              }),
            );
            return PersonSummary.make({ id: personId, name: person.name });
          }),
        { concurrency: "unbounded" },
      );
    });

  return PeopleCatalog.of({ getPerson, searchPeople });
};

export const makeStub = (
  getPerson: PeopleCatalog["getPerson"],
  searchPeople: PeopleCatalog["searchPeople"] = () => Effect.succeed([]),
) => PeopleCatalog.of({ getPerson, searchPeople });
