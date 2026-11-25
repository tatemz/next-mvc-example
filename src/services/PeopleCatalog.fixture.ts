import { Effect } from "effect";
import type { Person } from "../domain/FilmUniverse.model";
import { PersonSummary } from "../domain/FilmUniverse.model";
import { PeopleCatalog, PeopleCatalogError } from "./PeopleCatalog";

export const unusedCatalog: PeopleCatalog = {
  getPerson: () => Effect.die("getPerson is not used by this page"),
  searchPeople: () => Effect.die("searchPeople is not used by this page"),
};

export const unavailableCatalog: PeopleCatalog = {
  getPerson: () =>
    Effect.fail(
      new PeopleCatalogError({ message: "The catalogue is unavailable." }),
    ),
  searchPeople: () =>
    Effect.fail(
      new PeopleCatalogError({ message: "The catalogue is unavailable." }),
    ),
};

export const catalogOf = (people: readonly Person[]): PeopleCatalog => ({
  getPerson: (id) => {
    const person = people.find((candidate) => candidate.id === id);
    return person === undefined
      ? Effect.fail(
        new PeopleCatalogError({
          message: `Person ${id} is not available.`,
        }),
      )
      : Effect.succeed(person);
  },
  searchPeople: (query) => {
    const needle = query.trim().toLowerCase();
    return Effect.succeed(
      people
        .filter((person) => person.name.toLowerCase().includes(needle))
        .map((person) =>
          PersonSummary.make({ id: person.id, name: person.name })
        ),
    );
  },
});
