import { Effect, Number as Num, Option, String as Str } from "effect";
import type { CharacterId } from "../domain/CharacterId.model";
import { Film } from "../domain/Film.model";
import { Person } from "../domain/Person.model";
import type { SwapiClient } from "./SwapiApi";
import { StarWarsError, type StarWarsClient } from "./StarWarsClient";

const filmIdFromUrl = (url: string): number => {
  const trimmed = Str.replace(/\/+$/, "")(url);
  const slashIndex = Option.getOrElse(
    Str.lastIndexOf("/")(trimmed),
    () => -1,
  );
  return Option.getOrElse(
    Num.parse(Str.slice(slashIndex + 1)(trimmed)),
    () => NaN,
  );
};

const personUnavailable = (id: CharacterId) =>
  new StarWarsError({ message: `Person ${id} is not available.` });

const filmUnavailable = (id: CharacterId) =>
  new StarWarsError({ message: `A film for person ${id} is not available.` });

export const make = (swapi: SwapiClient): StarWarsClient => ({
  getPerson: Effect.fn("StarWarsClient.getPerson")(
    function*(id: CharacterId) {
      const person = yield* swapi.people.get({ params: { id } }).pipe(
        Effect.mapError(() => personUnavailable(id)),
      );

      const [firstUrl, ...restUrls] = person.films;
      const [firstFilm, restFilms] = yield* Effect.all(
        [
          swapi.films.get({ params: { id: filmIdFromUrl(firstUrl) } }),
          Effect.forEach(
            restUrls,
            (url) =>
              swapi.films.get({ params: { id: filmIdFromUrl(url) } }),
            { concurrency: "unbounded" },
          ),
        ],
        { concurrency: "unbounded" },
      ).pipe(Effect.mapError(() => filmUnavailable(id)));

      const films: [Film, ...Array<Film>] = [
        Film.make({
          title: firstFilm.title,
          episodeId: firstFilm.episode_id,
        }),
        ...restFilms.map((film) =>
          Film.make({
            title: film.title,
            episodeId: film.episode_id,
          }),
        ),
      ];

      return Person.make({
        id,
        name: person.name,
        height: person.height,
        mass: person.mass,
        films,
      });
    },
  ),
});

export const makeStub = (
  getPerson: StarWarsClient["getPerson"],
): StarWarsClient => ({ getPerson });
