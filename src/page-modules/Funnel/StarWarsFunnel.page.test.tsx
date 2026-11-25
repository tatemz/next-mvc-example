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

import { ConnectedFunnel } from "../../components/Funnel/Funnel.connected";
import { StarWarsFunnelPage } from "./StarWarsFunnel.page";

describe("StarWars funnel page", () => {
  it.effect("loads the initial funnel through the SWAPI runtime", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() => StarWarsFunnelPage());

      expect(element.type).toBe(ConnectedFunnel);
      expect(element.props).toMatchObject({
        model: { _tag: "Search", stepLabel: "Step 1 of 4" },
      });
      expect(typeof element.props.submitAction).toBe("function");
    }),
  );
});
