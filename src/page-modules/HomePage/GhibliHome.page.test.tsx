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

import { ConnectedHomePage } from "../../components/HomePage.connected";
import { GhibliHomePage } from "./GhibliHome.page";

describe("Ghibli home page", () => {
  it.effect("loads the Ghibli splash", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        GhibliHomePage({ searchParams: Promise.resolve({}) }),
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement<{ model: unknown }>(element)) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(ConnectedHomePage);
      expect(element.props.model).toMatchObject({
        _tag: "HomePageViewModel",
        universe: "ghibli",
        hero: {
          title: "Studio Ghibli character dossier",
          funnelHref: "/ghibli/funnel",
        },
        shell: { theme: "autumn" },
      });
    }),
  );
});
