import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect } from "vitest";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { haku, luke } from "../../domain/FilmUniverse.fixture";
import { catalogOf } from "../../services/PeopleCatalog.fixture";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { GhibliResultsPage } from "./GhibliResults.page";

const context = renderContext(catalogOf([haku]));

describe("Ghibli results page", () => {
  it.effect("loads a Ghibli dossier through the Ghibli catalog", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        runInRenderContext(
          context,
          () =>
            GhibliResultsPage({
              searchParams: Promise.resolve({
                character: "1",
                film: "1",
                transport: "none",
              }),
            }),
        )
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement(element)) throw new Error("expected an element");
      expect(element.type).toBe(ConnectedResultsView);
      expect(element.props).toMatchObject({
        model: {
          _tag: "Ready",
          shell: { universe: "ghibli", theme: "autumn" },
          person: { name: "Haku" },
          startOverHref: "/ghibli/funnel",
          homeHref: "/ghibli",
        },
      });
    }));
});
