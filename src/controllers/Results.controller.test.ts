import { Universes, NoTransportKey } from "../domain/FilmUniverse.model";
import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import { luke } from "../domain/FilmUniverse.fixture";
import { makeEn } from "../i18n/I18n.service";
import {
  PeopleCatalogError,
  type PeopleCatalog,
} from "../services/PeopleCatalog";
import { tag as parsedSearchParamsTag } from "../platform/ParsedSearchParams";
import { loadResults } from "./Results.controller";

const i18n = makeEn();

const services = (
  getPerson: PeopleCatalog["getPerson"],
): Parameters<typeof loadResults>[0] => ({
  universe: Universes.StarWars,
  i18n,
  catalog: {
    getPerson,
    searchPeople: () => Effect.succeed([]),
  },
});

const run = (
  params: Readonly<Record<string, string>>,
  getPerson: PeopleCatalog["getPerson"] = () => Effect.succeed(luke),
) =>
  loadResults(services(getPerson)).pipe(
    Effect.provideService(parsedSearchParamsTag, params),
  );

describe("loadResults", () => {
  it.effect("loads a complete dossier", () =>
    Effect.gen(function*() {
      const model = yield* run({
        character: "1",
        film: "4",
        transport: "starship-12",
      });

      expect(model).toMatchObject({
        _tag: "Ready",
        person: { name: "Luke Skywalker" },
        film: { order: 4 },
        transport: { key: "starship-12", name: "X-wing" },
        startOverHref: "/star-wars/funnel",
        homeHref: "/star-wars",
      });
    }),
  );

  it.effect("accepts an explicit no-transport choice", () =>
    Effect.gen(function*() {
      const model = yield* run({
        character: "1",
        film: "4",
        transport: NoTransportKey,
      });

      expect(model).toMatchObject({
        _tag: "Ready",
        transport: null,
      });
    }),
  );

  it.effect("renders a missing dossier when params do not decode", () =>
    Effect.gen(function*() {
      const model = yield* run({});

      expect(model).toMatchObject({ _tag: "Missing" });
    }),
  );

  it.effect("rejects a person load failure", () =>
    Effect.gen(function*() {
      const model = yield* run(
        { character: "1", film: "4", transport: NoTransportKey },
        () => Effect.fail(new PeopleCatalogError({ message: "down" })),
      );

      expect(model).toMatchObject({
        _tag: "Missing",
        startOverHref: "/star-wars/funnel",
      });
    }),
  );

  it.effect("rejects a film outside the person", () =>
    Effect.gen(function*() {
      const model = yield* run({
        character: "1",
        film: "99",
        transport: NoTransportKey,
      });

      expect(model).toMatchObject({ _tag: "Missing" });
    }),
  );

  it.effect("rejects a transport outside the person", () =>
    Effect.gen(function*() {
      const model = yield* run({
        character: "1",
        film: "4",
        transport: "starship-99",
      });

      expect(model).toMatchObject({ _tag: "Missing" });
    }),
  );
});
