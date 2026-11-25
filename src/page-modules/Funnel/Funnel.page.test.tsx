import { it } from "@effect/vitest";
import { Effect } from "effect";
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

import { FunnelPage } from "./Funnel.page";

describe("Funnel page", () => {
  it.effect("loads the initial funnel model through the runtime", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() => FunnelPage());

      expect(element.props).toMatchObject({
        _tag: "Search",
        stepLabel: "Step 1 of 4",
      });
    }),
  );
});
