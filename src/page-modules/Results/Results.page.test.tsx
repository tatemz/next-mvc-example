import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect, vi } from "vitest";

vi.mock("../../server/Runtime", async () => {
  const { Effect, Layer, ManagedRuntime } = await import("effect");
  const { layer: i18nLayer } = await import("../../i18n/I18n.service");
  const { layerStub } = await import("../../services/SwapiPeopleCatalog.layer");
  const { luke } = await import("../../domain/FilmUniverse.fixture");

  const runtime = ManagedRuntime.make(
    Layer.mergeAll(
      i18nLayer,
      layerStub(() => Effect.succeed(luke)),
    ),
  );

  return { swapiRuntime: runtime };
});

import { Results } from "../../components/Results/Results";
import { ResultsPage } from "./Results.page";

describe("Results page", () => {
  it.effect("loads typed search params through the runtime", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        ResultsPage({
          searchParams: Promise.resolve({
            character: "1",
            film: "4",
            transport: "starship-12",
          }),
        }),
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement(element)) throw new Error("expected an element");
      expect(element.type).toBe(Results);
      expect(element.props).toMatchObject({
        _tag: "Ready",
        person: { name: "Luke Skywalker" },
        transport: { key: "starship-12" },
      });
    }),
  );

  it.effect("takes the first value of array search params", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        ResultsPage({
          searchParams: Promise.resolve({
            character: ["1"],
            film: ["4"],
          }),
        }),
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement(element)) throw new Error("expected an element");
      expect(element.props).toMatchObject({
        _tag: "Ready",
        transport: null,
      });
    }),
  );

  it.effect("renders a missing dossier when params do not decode", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        ResultsPage({
          searchParams: Promise.resolve({ character: "1" }),
        }),
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement(element)) throw new Error("expected an element");
      expect(element.props).toMatchObject({ _tag: "Missing" });
    }),
  );
});
