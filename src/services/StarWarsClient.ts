import { Context, Effect, Schema } from "effect";
import type {
  CharacterId,
  Person,
  PersonSummary,
} from "../domain/StarWars.model";

export class StarWarsError extends Schema.TaggedError<StarWarsError>()(
  "StarWarsError",
  {
    message: Schema.NonEmptyString,
  },
) {}

export interface StarWarsClient {
  readonly getPerson: (
    id: CharacterId,
  ) => Effect.Effect<Person, StarWarsError>;
  readonly searchPeople: (
    query: string,
  ) => Effect.Effect<ReadonlyArray<PersonSummary>, StarWarsError>;
}

export const StarWarsClient = Context.Service<StarWarsClient>(
  "next-mvc-example/StarWarsClient",
);
