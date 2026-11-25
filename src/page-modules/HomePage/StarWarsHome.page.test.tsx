import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect, vi } from "vitest";

vi.mock("../../server/Runtime", async () => {
  const { ConfigProvider, Effect, Layer, ManagedRuntime } = await import(
    "effect"
  );
  const { layer: i18nLayer } = await import("../../i18n/I18n.service");
  const { layerStub } = await import("../../services/SwapiPeopleCatalog.layer");
  const { luke } = await import("../../domain/FilmUniverse.fixture");

  const runtime = ManagedRuntime.make(
    Layer.mergeAll(
      i18nLayer,
      layerStub(() => Effect.succeed(luke)),
      Layer.succeed(
        ConfigProvider.ConfigProvider,
        ConfigProvider.fromEnv({ env: { CHARACTER_ID: "1" } }),
      ),
    ),
  );

  return { swapiRuntime: runtime };
});

import { ConnectedHomePage } from "../../components/HomePage.connected";
import { StarWarsHomePage } from "./StarWarsHome.page";

describe("StarWars home page", () => {
  it.effect("loads the home through the SWAPI runtime", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        StarWarsHomePage({ searchParams: Promise.resolve({}) }),
      );

      expect(isValidElement(element)).toBe(true);
      if (
        !isValidElement<{ model: unknown; searchAction: unknown }>(element)
      ) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(ConnectedHomePage);
      expect(element.props.model).toMatchObject({
        _tag: "Loaded",
        hero: { funnelHref: "/star-wars/funnel" },
        shell: { theme: "night" },
      });
      expect(typeof element.props.searchAction).toBe("function");
    }),
  );
});
