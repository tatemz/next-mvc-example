import { Context, Effect, Ref } from "effect";
import {
  haku,
  luke,
  muska,
} from "../../src/domain/FilmUniverse.fixture";
import type { Person } from "../../src/domain/FilmUniverse.model";
import {
  Universes,
  type Universe,
} from "../../src/domain/FilmUniverse.model";
import { PeopleCatalog } from "../../src/services/PeopleCatalog";
import {
  catalogOf,
  unavailableCatalog,
} from "../../src/services/PeopleCatalog.fixture";

export const CatalogModes = {
  Working: "working",
  Unavailable: "unavailable",
} as const;
export type CatalogMode =
  (typeof CatalogModes)[keyof typeof CatalogModes];

export class CatalogControl extends Context.Service<
  CatalogControl,
  { readonly set: (mode: CatalogMode) => Effect.Effect<void> }
>()("next-mvc-example/test/CatalogControl") {}

const starWarsPeople: ReadonlyArray<Person> = [luke];
const ghibliPeople: ReadonlyArray<Person> = [haku, muska];

const catalog = (
  people: ReadonlyArray<Person>,
  mode: Ref.Ref<CatalogMode>,
): PeopleCatalog => {
  const working = catalogOf(people);

  return {
    getPerson: (id) =>
      Effect.flatMap(Ref.get(mode), (current) =>
        current === CatalogModes.Unavailable
          ? unavailableCatalog.getPerson(id)
          : working.getPerson(id)
      ),
    searchPeople: (query) =>
      Effect.flatMap(Ref.get(mode), (current) =>
        current === CatalogModes.Unavailable
          ? unavailableCatalog.searchPeople(query)
          : working.searchPeople(query)
      ),
  };
};

export const catalogs = (
  mode: Ref.Ref<CatalogMode>,
): Record<Universe, PeopleCatalog> => ({
  [Universes.StarWars]: catalog(starWarsPeople, mode),
  [Universes.Ghibli]: catalog(ghibliPeople, mode),
});
