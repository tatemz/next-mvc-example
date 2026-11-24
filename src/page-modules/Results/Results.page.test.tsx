import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect, vi } from "vitest";

vi.mock("../../server/Runtime", async () => {
  const { Effect, Layer, ManagedRuntime } = await import("effect");
  const { layer: i18nLayer } = await import("../../i18n/I18n.service");
  const { layerStub } = await import("../../services/StarWarsClient.layer");
  const { luke } = await import("../../domain/StarWars.fixture");

  const runtime = ManagedRuntime.make(
    Layer.mergeAll(
      i18nLayer,
      layerStub(() => Effect.succeed(luke)),
    ),
  );

  return { runtime };
});

import { ResultsPage } from "./Results.page";

describe("Results page", () => {
  it.effect("loads the dossier through the runtime", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        ResultsPage({
          searchParams: {
            character: "1",
            film: "4",
            transport: "starship-12",
          },
        }),
      );

      expect(element.props).toMatchObject({
        _tag: "Ready",
        person: { name: "Luke Skywalker" },
        transport: { key: "starship-12" },
      });
    }),
  );
});
