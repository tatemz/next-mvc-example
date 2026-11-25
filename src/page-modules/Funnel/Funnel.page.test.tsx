import { ExperienceThemes } from "../../components/AppShell";
import { Universes } from "../../domain/FilmUniverse.model";
import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect } from "vitest";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import { NotFoundView } from "../../components/NotFoundView";
import { unusedCatalog } from "../../services/PeopleCatalog.fixture";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { FunnelPage } from "./Funnel.page";

const render = (universe: string) =>
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
      const element = yield* render(Universes.StarWars);

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
        shell: { universe: Universes.StarWars, theme: ExperienceThemes.Night },
      });
      expect(typeof element.props.submitAction).toBe("function");
    }));

  it.effect("renders not found for an unknown universe", () =>
    Effect.gen(function*() {
      const element = yield* render("unknown");

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement<{ model: { _tag: string } }>(element)) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(NotFoundView);
      expect(element.props.model._tag).toBe("NotFoundViewModel");
    }));

  it.effect("loads the Ghibli funnel", () =>
    Effect.gen(function*() {
      const element = yield* render(Universes.Ghibli);

      expect(isValidElement(element)).toBe(true);
      if (
        !isValidElement<{ model: unknown; submitAction: unknown }>(element)
      ) {
        throw new Error("expected an element");
      }
      expect(element.props.model).toMatchObject({
        _tag: "Search",
        stepLabel: "Step 1 of 4",
        shell: { universe: Universes.Ghibli, theme: ExperienceThemes.Autumn },
      });
    }));
});
