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

import { ConnectedResults } from "../../components/Results.connected";
import { StarWarsResultsPage } from "./StarWarsResults.page";

describe("Results page", () => {
  it.effect("loads typed search params through the runtime", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        StarWarsResultsPage({
          searchParams: Promise.resolve({
            character: "1",
            film: "4",
            transport: "starship-12",
          }),
        }),
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement(element)) throw new Error("expected an element");
      expect(element.type).toBe(ConnectedResults);
      expect(element.props).toMatchObject({
        universe: "star-wars",
        model: {
          _tag: "Ready",
          person: { name: "Luke Skywalker" },
          transport: { key: "starship-12" },
          startOverHref: "/star-wars/funnel",
          homeHref: "/star-wars",
        },
      });
    }),
  );

  it.effect("takes the first value of array search params", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        StarWarsResultsPage({
          searchParams: Promise.resolve({
            character: ["1"],
            film: ["4"],
            transport: ["none"],
          }),
        }),
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement(element)) throw new Error("expected an element");
      expect(element.props).toMatchObject({
        universe: "star-wars",
        model: {
          _tag: "Ready",
          transport: null,
          startOverHref: "/star-wars/funnel",
          homeHref: "/star-wars",
        },
      });
    }),
  );

  it.effect("renders a missing dossier when transport is absent", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        StarWarsResultsPage({
          searchParams: Promise.resolve({ character: "1", film: "4" }),
        }),
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement(element)) throw new Error("expected an element");
      expect(element.props).toMatchObject({
        universe: "star-wars",
        model: {
          _tag: "Missing",
          startOverHref: "/star-wars/funnel",
        },
      });
    }),
  );

  it.effect("renders a missing dossier when params do not decode", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        StarWarsResultsPage({
          searchParams: Promise.resolve({ character: "1" }),
        }),
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement(element)) throw new Error("expected an element");
      expect(element.props).toMatchObject({
        universe: "star-wars",
        model: {
          _tag: "Missing",
          startOverHref: "/star-wars/funnel",
        },
      });
    }),
  );
});
