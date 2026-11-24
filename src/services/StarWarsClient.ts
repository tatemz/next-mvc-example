import { Config, Context, Effect, Layer, Schema } from "effect";
import { HttpClient, HttpClientResponse } from "effect/http";
import { Film, Person } from "../domain/Person";

const PersonResponse = Schema.Struct({
  name: Schema.NonEmptyString,
  height: Schema.String,
  mass: Schema.String,
  films: Schema.NonEmptyArray(Schema.String),
});

const FilmResponse = Schema.Struct({
  title: Schema.NonEmptyString,
  episode_id: Schema.Int,
});

export class StarWarsError extends Schema.TaggedError<StarWarsError>()(
  "StarWarsError",
  {
    message: Schema.NonEmptyString,
  },
) {}

const apiUrl = Config.String("STAR_WARS_API_URL").pipe(
  Config.withDefault("https://swapi.dev/api"),
);

export class StarWarsClient extends Context.Service<
  StarWarsClient,
  {
    readonly getPerson: (id: number) => Effect.Effect<Person, StarWarsError>;
  }
>()("next-mvc-example/StarWarsClient") {
  static readonly layer = Layer.effect(
    StarWarsClient,
    Effect.gen(function*() {
      const http = (yield* HttpClient.HttpClient).pipe(
        HttpClient.filterStatusOk,
      );
      const baseUrl = (yield* apiUrl).replace(/\/$/, "");

      const getPerson = Effect.fn("StarWarsClient.getPerson")(
        function*(id: number) {
          const person = yield* http.get(`${baseUrl}/people/${id}/`).pipe(
            Effect.flatMap(HttpClientResponse.schemaBodyJson(PersonResponse)),
            Effect.mapError(
              () =>
                new StarWarsError({
                  message: `Person ${id} is not available.`,
                }),
            ),
          );

          const films = yield* Effect.forEach(
            person.films,
            (url) =>
              http.get(new URL(url, `${baseUrl}/`)).pipe(
                Effect.flatMap(
                  HttpClientResponse.schemaBodyJson(FilmResponse),
                ),
                Effect.mapError(
                  () =>
                    new StarWarsError({
                      message: `A film for person ${id} is not available.`,
                    }),
                ),
              ),
            { concurrency: "unbounded" },
          ).pipe(
            Effect.mapError(
              (error) => new StarWarsError({ message: error.message }),
            ),
          );

          const [first, ...rest] = films;
          if (first === undefined) {
            return yield* new StarWarsError({
              message: `Person ${id} has no films.`,
            });
          }

          const domainFilms: [Film, ...Array<Film>] = [
            Film.make({
              title: first.title,
              episodeId: first.episode_id,
            }),
            ...rest.map((film) =>
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
            films: domainFilms,
          });
        },
      );

      return StarWarsClient.of({ getPerson });
    }),
  );
}
