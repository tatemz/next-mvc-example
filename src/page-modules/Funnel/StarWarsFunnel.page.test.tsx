import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect } from "vitest";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import { unusedCatalog } from "../../services/PeopleCatalog.fixture";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { StarWarsFunnelPage } from "./StarWarsFunnel.page";

const context = renderContext(unusedCatalog);

describe("StarWars funnel page", () => {
  it.effect("loads the initial funnel for the Star Wars universe", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        runInRenderContext(
          context,
          () => StarWarsFunnelPage({ searchParams: Promise.resolve({}) }),
        )
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
        stepLabel: "Step 1 of 4",
      });
      expect(typeof element.props.submitAction).toBe("function");
    }));
});
