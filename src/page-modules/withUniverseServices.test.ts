import { it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { describe, expect } from "vitest";
import { haku, luke } from "../domain/FilmUniverse.fixture";
import { Universes } from "../domain/FilmUniverse.model";
import {
  I18nCatalog,
  makeI18nCatalog,
} from "../i18n/I18n.service";
import { Locales } from "../i18n/Locale";
import { tag as pathParamsTag } from "../platform/ParsedPathParams";
import { tag as searchParamsTag } from "../platform/ParsedSearchParams";
import { Catalogs } from "../services/Catalogs";
import { catalogOf } from "../services/PeopleCatalog.fixture";
import { withUniverseServices } from "./withUniverseServices";

const catalogs = {
  [Universes.StarWars]: catalogOf([luke]),
  [Universes.Ghibli]: catalogOf([haku]),
};

const dependencies = (params: {
  readonly locale?: string;
  readonly universe: string;
}) =>
  Layer.mergeAll(
    Layer.succeed(Catalogs, catalogs),
    Layer.succeed(I18nCatalog, makeI18nCatalog()),
    Layer.succeed(pathParamsTag, params),
    Layer.succeed(searchParamsTag, {}),
  );

const nameFor = withUniverseServices(({ universe, catalog, i18n }) =>
  Effect.gen(function*() {
    const people = yield* catalog.searchPeople("");
    return {
      universe,
      locale: i18n.locale,
      name: people[0]?.name,
      message: i18n._({ id: "funnel.search.noResults" }),
    };
  })
);

describe("withUniverseServices", () => {
  it.effect("defaults to US English and the Star Wars catalog", () =>
    Effect.gen(function*() {
      const result = yield* nameFor.pipe(
        Effect.provide(dependencies({ universe: Universes.StarWars })),
      );

      expect(result).toMatchObject({
        universe: Universes.StarWars,
        locale: Locales.EnUS,
        name: "Luke Skywalker",
        message: "No characters matched that name.",
      });
    }));

  it.effect("selects Spanish and the Ghibli catalog", () =>
    Effect.gen(function*() {
      const result = yield* nameFor.pipe(
        Effect.provide(
          dependencies({
            locale: Locales.EsMX,
            universe: Universes.Ghibli,
          }),
        ),
      );

      expect(result).toMatchObject({
        universe: Universes.Ghibli,
        locale: Locales.EsMX,
        name: "Haku",
        message: "Ningún personaje coincide con ese nombre.",
      });
    }));

  it.effect("returns NotFound in the requested locale", () =>
    Effect.gen(function*() {
      const result = yield* withUniverseServices(() =>
        Effect.die("the builder must not run")
      ).pipe(
        Effect.provide(
          dependencies({
            locale: Locales.EsMX,
            universe: "unknown",
          }),
        ),
      );

      expect(result).toMatchObject({
        _tag: "NotFoundViewModel",
        heading: "Página no encontrada",
      });
    }));
});
