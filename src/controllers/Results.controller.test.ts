import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import { luke, makeCharacterId } from "../domain/FilmUniverse.fixture";
import { I18n, makeEn } from "../i18n/I18n.service";
import { makeAppShellViewModel } from "../components/AppShell";
import {
  PeopleCatalogError,
  type PeopleCatalog,
} from "../services/PeopleCatalog";
import { layerStub } from "../services/SwapiPeopleCatalog.layer";
import { loadResults, type ResultsParams } from "./Results.controller";

const i18n = makeEn();
const shell = makeAppShellViewModel(i18n, "star-wars");

const run = (
  params: ResultsParams,
  getPerson: PeopleCatalog["getPerson"] = () => Effect.succeed(luke),
) =>
  loadResults("star-wars", params, shell).pipe(
    Effect.provide(layerStub(getPerson)),
    Effect.provideService(I18n, i18n),
  );

describe("loadResults", () => {
  it.effect("loads a complete dossier", () =>
    Effect.gen(function*() {
      const model = yield* run({
        character: makeCharacterId("1"),
        film: 4,
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
        character: makeCharacterId("1"),
        film: 4,
        transport: "none",
      });

      expect(model).toMatchObject({
        _tag: "Ready",
        transport: null,
      });
    }),
  );

  it.effect("rejects a person load failure", () =>
    Effect.gen(function*() {
      const model = yield* run(
        { character: makeCharacterId("1"), film: 4, transport: "none" },
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
        character: makeCharacterId("1"),
        film: 99,
        transport: "none",
      });

      expect(model).toMatchObject({ _tag: "Missing" });
    }),
  );

  it.effect("rejects a transport outside the person", () =>
    Effect.gen(function*() {
      const model = yield* run({
        character: makeCharacterId("1"),
        film: 4,
        transport: "starship-99",
      });

      expect(model).toMatchObject({ _tag: "Missing" });
    }),
  );
});
