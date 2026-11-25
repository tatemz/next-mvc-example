import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect } from "vitest";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import { unusedCatalog } from "../../services/PeopleCatalog.fixture";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { GhibliFunnelPage } from "./GhibliFunnel.page";

const context = renderContext(unusedCatalog);

describe("Ghibli funnel page", () => {
  it.effect("loads the initial funnel for the Ghibli universe", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        runInRenderContext(
          context,
          () => GhibliFunnelPage({ searchParams: Promise.resolve({}) }),
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
        shell: { theme: "autumn" },
      });
      expect(typeof element.props.submitAction).toBe("function");
    }));
});
