import {
  Array,
  Effect,
  Function,
  Number as Num,
  Option,
  Result,
  String as Str,
} from "effect";
import { Url } from "effect/http";
import { Film, Person, type CharacterId } from "../domain/StarWars.model";
import type { FilmResponse, PersonResponse, SwapiClient } from "./SwapiApi";
import { StarWarsClient, StarWarsError } from "./StarWarsClient";

const filmIdFromPath = Function.flow(
  Str.split("/"),
  Array.filter(Str.isNonEmpty),
  Array.last,
  Option.flatMap(Num.parse),
);

const filmIdFromUrl = Function.flow(
  (url: string) => Url.fromString(url),
  Result.match({
    onFailure: () => Option.none<number>(),
    onSuccess: ({ pathname }) => filmIdFromPath(pathname),
  }),
);

const toFilm = (film: FilmResponse) =>
  Film.make({
    title: film.title,
    episodeId: film.episode_id,
  });

export const make = (swapi: SwapiClient) => {
  const getFilms = (urls: PersonResponse["films"], id: CharacterId) =>
    Function.pipe(
      urls,
      Effect.forEach(
        Function.flow(
          filmIdFromUrl,
          Option.match({
            onNone: () =>
              Effect.fail(
                new StarWarsError({
                  message: `A film for person ${id} is not available.`,
                }),
              ),
            onSome: Function.flow(
              (filmId: number) =>
                swapi.films.get({ params: { id: filmId } }),
              Effect.mapError(
                () =>
                  new StarWarsError({
                    message: `A film for person ${id} is not available.`,
                  }),
              ),
            ),
          }),
        ),
        { concurrency: "unbounded" },
      ),
    );

  return StarWarsClient.of({
    getPerson: Effect.fn("StarWarsClient.getPerson")(
      function*(id: CharacterId) {
        const person = yield* Function.pipe(
          swapi.people.get({ params: { id } }),
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
          films: Function.pipe(films, Array.map(toFilm)),
        });
      },
    ),
  });
};

export const makeStub = (getPerson: StarWarsClient["getPerson"]) =>
  StarWarsClient.of({ getPerson });
