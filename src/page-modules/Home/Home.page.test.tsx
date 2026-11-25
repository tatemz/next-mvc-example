import { ExperienceThemes } from "../../components/AppShell";
import { Universes } from "../../domain/FilmUniverse.model";
import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect } from "vitest";
import { ConnectedHomeView } from "../../components/HomeView.connected";
import { NotFoundView } from "../../components/NotFoundView";
import { unusedCatalog } from "../../services/PeopleCatalog.fixture";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { HomePage } from "./Home.page";

const render = (universe: string) =>
  Effect.promise(() =>
    runInRenderContext(renderContext(unusedCatalog), () =>
      HomePage({
        params: Promise.resolve({ universe }),
        searchParams: Promise.resolve({}),
      })
    )
  );

describe("Home page", () => {
  it.effect("loads the Star Wars splash", () =>
    Effect.gen(function*() {
      const element = yield* render(Universes.StarWars);

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement<{ model: unknown }>(element)) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(ConnectedHomeView);
      expect(element.props.model).toMatchObject({
        _tag: "HomeViewModel",
        hero: {
          title: "Star Wars character dossier",
          funnelHref: "/star-wars/funnel",
        },
        shell: { universe: Universes.StarWars, theme: ExperienceThemes.Night },
      });
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

  it.effect("loads the Ghibli splash", () =>
    Effect.gen(function*() {
      const element = yield* render(Universes.Ghibli);

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement<{ model: unknown }>(element)) {
        throw new Error("expected an element");
      }
      expect(element.props.model).toMatchObject({
        _tag: "HomeViewModel",
        hero: {
          title: "Studio Ghibli character dossier",
          funnelHref: "/ghibli/funnel",
        },
        shell: { universe: Universes.Ghibli, theme: ExperienceThemes.Autumn },
      });
    }));
});
