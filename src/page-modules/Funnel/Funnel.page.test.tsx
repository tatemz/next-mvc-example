import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect } from "vitest";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import type { Universe } from "../../domain/FilmUniverse.model";
import { unusedCatalog } from "../../services/PeopleCatalog.fixture";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { FunnelPage } from "./Funnel.page";

const render = (universe: Universe) =>
  Effect.promise(() =>
    runInRenderContext(renderContext(unusedCatalog), () =>
      FunnelPage({
        params: Promise.resolve({ universe }),
        searchParams: Promise.resolve({}),
      })
    )
  );

describe("Funnel page", () => {
  it.effect("loads the Star Wars funnel", () =>
    Effect.gen(function*() {
      const element = yield* render("star-wars");

      expect(isValidElement(element)).toBe(true);
      if (
        !isValidElement<{ model: unknown; submitAction: unknown }>(element)
      ) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(ConnectedFunnelView);
      expect(element.props.model).toMatchObject({
        _tag: "Search",
        stepLabel: "Step 1 of 4",
        shell: { universe: "star-wars", theme: "night" },
      });
      expect(typeof element.props.submitAction).toBe("function");
    }));

  it.effect("loads the Ghibli funnel", () =>
    Effect.gen(function*() {
      const element = yield* render("ghibli");

      expect(isValidElement(element)).toBe(true);
      if (
        !isValidElement<{ model: unknown; submitAction: unknown }>(element)
      ) {
        throw new Error("expected an element");
      }
      expect(element.props.model).toMatchObject({
        _tag: "Search",
        stepLabel: "Step 1 of 4",
        shell: { universe: "ghibli", theme: "autumn" },
      });
    }));
});
