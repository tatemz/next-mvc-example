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

import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import { StarWarsFunnelPage } from "./StarWarsFunnel.page";

describe("StarWars funnel page", () => {
  it.effect("loads the initial funnel through the SWAPI runtime", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        StarWarsFunnelPage({ searchParams: Promise.resolve({}) }),
      );

      expect(isValidElement(element)).toBe(true);
      if (
        !isValidElement<{ model: unknown; submitAction: unknown }>(element)
      ) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(ConnectedFunnelView);
      expect(element.props).toMatchObject({
        model: { _tag: "Search", stepLabel: "Step 1 of 4" },
      });
      expect(typeof element.props.submitAction).toBe("function");
    }),
  );
});
