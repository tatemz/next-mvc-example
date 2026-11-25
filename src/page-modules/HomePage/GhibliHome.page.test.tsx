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
  const { makeCharacterId, personNamed } = await import(
    "../../domain/FilmUniverse.fixture"
  );

  const runtime = ManagedRuntime.make(
    Layer.mergeAll(
      i18nLayer,
      layerStub(() =>
        Effect.succeed(personNamed(makeCharacterId("1"), "Haku")),
      ),
      Layer.succeed(
        ConfigProvider.ConfigProvider,
        ConfigProvider.fromEnv({ env: { CHARACTER_ID: "1" } }),
      ),
    ),
  );

  return { ghibliRuntime: runtime };
});

import { ConnectedHomePage } from "../../components/HomePage.connected";
import { GhibliHomePage } from "./GhibliHome.page";

describe("Ghibli home page", () => {
  it.effect("loads the home through the Ghibli runtime", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        GhibliHomePage({ searchParams: Promise.resolve({}) }),
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
        person: { name: "Haku" },
        hero: { funnelHref: "/ghibli/funnel" },
        shell: { theme: "autumn" },
      });
      expect(typeof element.props.searchAction).toBe("function");
    }),
  );
});
