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

  return { ghibliRuntime: runtime };
});

import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import { GhibliFunnelPage } from "./GhibliFunnel.page";

describe("Ghibli funnel page", () => {
  it.effect("loads the initial funnel through the Ghibli runtime", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        GhibliFunnelPage({ searchParams: Promise.resolve({}) }),
      );

      expect(isValidElement(element)).toBe(true);
      if (
        !isValidElement<{ model: unknown; submitAction: unknown }>(element)
      ) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(ConnectedFunnelView);
      expect(element.props.model).toMatchObject({
        _tag: "Search",
        shell: { theme: "autumn" },
      });
      expect(typeof element.props.submitAction).toBe("function");
    }),
  );
});
