import { it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { describe, expect } from "vitest";
import { haku, luke } from "../domain/FilmUniverse.fixture";
import { Universes } from "../domain/FilmUniverse.model";
import { I18n, makeEn } from "../i18n/I18n.service";
import { tag as pathParamsTag } from "../platform/ParsedPathParams";
import { tag as searchParamsTag } from "../platform/ParsedSearchParams";
import { Catalogs } from "../services/Catalogs";
import { catalogOf } from "../services/PeopleCatalog.fixture";
import {
  withUniverseFor,
  withUniverseServices,
} from "./withUniverseServices";

const catalogs = {
  [Universes.StarWars]: catalogOf([luke]),
  [Universes.Ghibli]: catalogOf([haku]),
};

const i18n = makeEn();

const dependencies = (universe: string) =>
  Layer.mergeAll(
    Layer.succeed(Catalogs, catalogs),
    Layer.succeed(I18n, i18n),
    Layer.succeed(pathParamsTag, { universe }),
    Layer.succeed(searchParamsTag, {}),
  );

const nameFor = withUniverseServices(({ universe, catalog, i18n }) =>
  Effect.gen(function*() {
    const people = yield* catalog.searchPeople("");
    return {
      universe,
      name: people[0]?.name,
      message: i18n._({ id: "funnel.search.noResults" }),
    };
  })
);

describe("withUniverseServices", () => {
  it.effect("selects the Star Wars catalog and i18n", () =>
    Effect.gen(function*() {
      const result = yield* nameFor.pipe(
        Effect.provide(dependencies(Universes.StarWars)),
      );

      expect(result).toMatchObject({
        universe: Universes.StarWars,
        name: "Luke Skywalker",
        message: "No characters matched that name.",
      });
    }));

  it.effect("selects the Ghibli catalog", () =>
    Effect.gen(function*() {
      const result = yield* nameFor.pipe(
        Effect.provide(dependencies(Universes.Ghibli)),
      );

      expect(result).toMatchObject({
        universe: Universes.Ghibli,
        name: "Haku",
      });
    }));

  it.effect("returns NotFound for an unknown universe", () =>
    Effect.gen(function*() {
      const result = yield* withUniverseServices(() =>
        Effect.die("the builder must not run")
      ).pipe(Effect.provide(dependencies("unknown")));

      expect(result).toMatchObject({ _tag: "NotFoundViewModel" });
    }));
});

describe("withUniverseFor", () => {
  it.effect("selects a catalog for a known universe", () =>
    Effect.gen(function*() {
      const result = yield* withUniverseFor(Universes.Ghibli)(
        ({ catalog }) => catalog.searchPeople("")
      ).pipe(
        Effect.provide(
          Layer.mergeAll(
            Layer.succeed(Catalogs, catalogs),
            Layer.succeed(I18n, i18n),
          ),
        ),
      );

      expect(result.map((person) => person.name)).toEqual(["Haku"]);
    }));
});
