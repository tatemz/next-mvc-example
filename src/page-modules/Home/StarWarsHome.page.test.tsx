import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect, vi } from "vitest";

vi.mock("../../server/Runtime", async () => {
  const { ManagedRuntime } = await import("effect");
  const { layer: i18nLayer } = await import("../../i18n/I18n.service");

  return {
    shellRuntime: ManagedRuntime.make(i18nLayer),
  };
});

import { ConnectedHomeView } from "../../components/HomeView.connected";
import { StarWarsHomePage } from "./StarWarsHome.page";

describe("StarWars home page", () => {
  it.effect("loads the Star Wars splash", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        StarWarsHomePage({ searchParams: Promise.resolve({}) }),
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement<{ model: unknown; universe: unknown }>(element)) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(ConnectedHomeView);
      expect(element.props.universe).toBe("star-wars");
      expect(element.props.model).toMatchObject({
        _tag: "HomeViewModel",
        hero: {
          title: "Star Wars character dossier",
          funnelHref: "/star-wars/funnel",
        },
        shell: { theme: "night" },
      });
    }),
  );
});
