import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect } from "vitest";
import { ConnectedHomeView } from "../../components/HomeView.connected";
import { unusedCatalog } from "../../services/PeopleCatalog.fixture";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { StarWarsHomePage } from "./StarWarsHome.page";

const context = renderContext(unusedCatalog);

describe("StarWars home page", () => {
  it.effect("loads the Star Wars splash", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        runInRenderContext(
          context,
          () => StarWarsHomePage({ searchParams: Promise.resolve({}) }),
        )
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement<{ model: unknown; universe: unknown }>(element)) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(ConnectedHomeView);
      expect(element.props.model).toMatchObject({
        _tag: "HomeViewModel",
        hero: {
          title: "Star Wars character dossier",
          funnelHref: "/star-wars/funnel",
        },
        shell: { universe: "star-wars", theme: "night" },
      });
    }));
});
