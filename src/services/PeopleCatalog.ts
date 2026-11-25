import { Context, Effect, Schema } from "effect";
import type {
  CharacterId,
  Person,
  PersonSummary,
} from "../domain/FilmUniverse.model";

export class PeopleCatalogError extends Schema.TaggedError<PeopleCatalogError>()(
  "PeopleCatalogError",
  {
    message: Schema.NonEmptyString,
  },
) {}

export interface PeopleCatalog {
  readonly getPerson: (
    id: CharacterId,
  ) => Effect.Effect<Person, PeopleCatalogError>;
  readonly searchPeople: (
    query: string,
  ) => Effect.Effect<ReadonlyArray<PersonSummary>, PeopleCatalogError>;
}

export const PeopleCatalog = Context.Service<PeopleCatalog>(
  "next-mvc-example/PeopleCatalog",
);
