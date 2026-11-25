import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect, vi } from "vitest";

vi.mock("../../server/Runtime", async () => {
  const { Effect, Layer, ManagedRuntime } = await import("effect");
  const { layer: i18nLayer } = await import("../../i18n/I18n.service");
  const { layerStub } = await import("../../services/SwapiPeopleCatalog.layer");
  const { makeCharacterId, personNamed } = await import(
    "../../domain/FilmUniverse.fixture"
  );

  const runtime = ManagedRuntime.make(
    Layer.mergeAll(
      i18nLayer,
      layerStub(() =>
        Effect.succeed(personNamed(makeCharacterId("1"), "Haku")),
      ),
    ),
  );

  return { ghibliRuntime: runtime };
});

import { ConnectedResults } from "../../components/Results.connected";
import { GhibliResultsPage } from "./GhibliResults.page";

describe("Ghibli results page", () => {
  it.effect("loads a Ghibli dossier through the Ghibli runtime", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        GhibliResultsPage({
          searchParams: Promise.resolve({
            character: "1",
            film: "4",
            transport: "none",
          }),
        }),
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement(element)) throw new Error("expected an element");
      expect(element.type).toBe(ConnectedResults);
      expect(element.props).toMatchObject({
        universe: "ghibli",
        model: {
          _tag: "Ready",
          person: { name: "Haku" },
          shell: { theme: "autumn" },
          startOverHref: "/ghibli/funnel",
          homeHref: "/ghibli",
        },
      });
    }),
  );
});
