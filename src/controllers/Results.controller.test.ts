import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import { luke } from "../domain/FilmUniverse.fixture";
import { I18n, makeEn } from "../i18n/I18n.service";
import {
  PeopleCatalogError,
  type PeopleCatalog,
} from "../services/PeopleCatalog";
import { layerStub } from "../services/SwapiPeopleCatalog.layer";
import { loadResults } from "./Results.controller";

const i18n = makeEn();

const run = (
  params: Parameters<typeof loadResults>[0],
  getPerson: PeopleCatalog["getPerson"] = () => Effect.succeed(luke),
) =>
  loadResults(params).pipe(
    Effect.provide(layerStub(getPerson)),
    Effect.provideService(I18n, i18n),
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
      });
    }),
  );

  it.effect("accepts array params and an omitted transport", () =>
    Effect.gen(function*() {
      const model = yield* run({
        character: ["1"],
        film: ["4"],
      });

      expect(model).toMatchObject({
        _tag: "Ready",
        transport: null,
      });
    }),
  );

  it.effect("rejects params that do not decode", () =>
    Effect.gen(function*() {
      const model = yield* run({});

      expect(model).toMatchObject({ _tag: "Missing" });
    }),
  );

  it.effect("rejects a person load failure", () =>
    Effect.gen(function*() {
      const model = yield* run(
        { character: "1", film: "4" },
        () => Effect.fail(new PeopleCatalogError({ message: "down" })),
      );

      expect(model).toMatchObject({ _tag: "Missing" });
    }),
  );

  it.effect("rejects a film outside the person", () =>
    Effect.gen(function*() {
      const model = yield* run({ character: "1", film: "99" });

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
