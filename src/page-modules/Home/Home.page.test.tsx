import { ExperienceThemes } from "../../components/AppShell";
import { Universes } from "../../domain/FilmUniverse.model";
import { Locales } from "../../i18n/Locale";
import { it } from "@effect/vitest";
import { Effect, Match } from "effect";
import { isValidElement } from "react";
import { describe, expect } from "vitest";
import type { HomeViewModel } from "../../components/HomeView";
import { ConnectedHomeView } from "../../components/HomeView.connected";
import {
  NotFoundView,
  type NotFoundViewModel,
} from "../../components/NotFoundView";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { HomePage } from "./Home.page";

const pathParams = (
  universe: string,
  locale?: string,
): Record<string, string> =>
  locale === undefined ? { universe } : { locale, universe };

const render = (universe: string, locale?: string) =>
  Effect.promise(() =>
    runInRenderContext(renderContext(), () =>
      HomePage({
        params: Promise.resolve(pathParams(universe, locale)),
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
      if (
        !isValidElement<{ model: HomeViewModel | NotFoundViewModel }>(
          element,
        )
      ) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(NotFoundView);
      expect(
        Match.valueTags(element.props.model, {
          NotFoundViewModel: () => true,
          HomeViewModel: () => false,
        }),
      ).toBe(true);
    }));

  it.effect("loads the Spanish splash", () =>
    Effect.gen(function*() {
      const element = yield* render(Universes.StarWars, Locales.EsMX);

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement<{ model: unknown }>(element)) {
        throw new Error("expected an element");
      }
      expect(element.props.model).toMatchObject({
        _tag: "HomeViewModel",
        hero: {
          title: "Dossier de personaje de Star Wars",
          funnelHref: "/es-MX/star-wars/funnel",
        },
        shell: { locale: Locales.EsMX },
      });
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
