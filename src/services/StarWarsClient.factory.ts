import { Array, Effect, Number as Num, Option, Result, String as Str, pipe } from "effect";
import { Url } from "effect/http";
import { Film, Person, type CharacterId } from "../domain/StarWars.model";
import type { FilmResponse, PersonResponse, SwapiClient } from "./SwapiApi";
import { StarWarsClient, StarWarsError } from "./StarWarsClient";

const filmIdFromUrl = (url: string) =>
  Url.fromString(url).pipe(
    Result.match({
      onFailure: () => NaN,
      onSuccess: ({ pathname }) =>
        pipe(
          Str.split(pathname, "/"),
          Array.filter(Str.isNonEmpty),
          Array.last,
          Option.flatMap(Num.parse),
          Option.getOrElse(() => NaN),
        ),
    }),
  );

const toFilm = (film: FilmResponse) =>
  Film.make({
    title: film.title,
    episodeId: film.episode_id,
  });

export const make = (swapi: SwapiClient) => {
  const getFilms = (urls: PersonResponse["films"], id: CharacterId) =>
    Effect.forEach(
      urls,
      (url) => swapi.films.get({ params: { id: filmIdFromUrl(url) } }),
      { concurrency: "unbounded" },
    ).pipe(
      Effect.mapError(
        () =>
          new StarWarsError({
            message: `A film for person ${id} is not available.`,
          }),
      ),
    );

  return StarWarsClient.of({
    getPerson: Effect.fn("StarWarsClient.getPerson")(
      function*(id: CharacterId) {
        const person = yield* swapi.people.get({ params: { id } }).pipe(
          Effect.mapError(
            () =>
              new StarWarsError({
                message: `Person ${id} is not available.`,
              }),
          ),
        );

        const films = yield* getFilms(person.films, id);

        return Person.make({
          id,
          name: person.name,
          height: person.height,
          mass: person.mass,
          films: Array.map(films, toFilm),
        });
      },
    ),
  });
};

export const makeStub = (getPerson: StarWarsClient["getPerson"]) =>
  StarWarsClient.of({ getPerson });
