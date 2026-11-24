import { Context, Effect, Schema } from "effect";
import type { CharacterId } from "../domain/CharacterId.model";
import type { Person } from "../domain/Person.model";

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
}

export const StarWarsClient = Context.Service<StarWarsClient>(
  "next-mvc-example/StarWarsClient",
);
