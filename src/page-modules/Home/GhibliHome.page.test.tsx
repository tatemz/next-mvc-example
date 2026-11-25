import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect } from "vitest";
import { ConnectedHomeView } from "../../components/HomeView.connected";
import { unusedCatalog } from "../../services/PeopleCatalog.fixture";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { GhibliHomePage } from "./GhibliHome.page";

const context = renderContext(unusedCatalog);

describe("Ghibli home page", () => {
  it.effect("loads the Ghibli splash", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        runInRenderContext(
          context,
          () => GhibliHomePage({ searchParams: Promise.resolve({}) }),
        )
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement<{ model: unknown; universe: unknown }>(element)) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(ConnectedHomeView);
      expect(element.props.universe).toBe("ghibli");
      expect(element.props.model).toMatchObject({
        _tag: "HomeViewModel",
        hero: {
          title: "Studio Ghibli character dossier",
          funnelHref: "/ghibli/funnel",
        },
        shell: { theme: "autumn" },
      });
    }));
});
