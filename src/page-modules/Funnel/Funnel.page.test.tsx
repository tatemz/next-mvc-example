import { ExperienceThemes } from "../../components/AppShell";
import { Universes } from "../../domain/FilmUniverse.model";
import { Locales } from "../../i18n/Locale";
import { it } from "@effect/vitest";
import { Effect, Match } from "effect";
import { isValidElement } from "react";
import { describe, expect } from "vitest";
import type { FunnelViewModel } from "../../components/FunnelView";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import {
  NotFoundView,
  type NotFoundViewModel,
} from "../../components/NotFoundView";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { FunnelPage } from "./Funnel.page";

const pathParams = (
  universe: string,
  locale?: string,
): Record<string, string> =>
  locale === undefined ? { universe } : { locale, universe };

const render = (universe: string, locale?: string) =>
  Effect.promise(() =>
    runInRenderContext(renderContext(), () =>
      FunnelPage({
        params: Promise.resolve(pathParams(universe, locale)),
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
      if (
        !isValidElement<{
          model: FunnelViewModel | NotFoundViewModel;
        }>(element)
      ) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(NotFoundView);
      expect(
        Match.valueTags(element.props.model, {
          NotFoundViewModel: () => true,
          Search: () => false,
          Choose: () => false,
          Film: () => false,
          Transport: () => false,
          Review: () => false,
          Failed: () => false,
        }),
      ).toBe(true);
    }));

  it.effect("loads the Spanish funnel", () =>
    Effect.gen(function*() {
      const element = yield* render(Universes.StarWars, Locales.EsMX);

      expect(isValidElement(element)).toBe(true);
      if (
        !isValidElement<{ model: unknown; submitAction: unknown }>(element)
      ) {
        throw new Error("expected an element");
      }
      expect(element.props.model).toMatchObject({
        _tag: "Search",
        stepLabel: "Paso 1 de 4",
        shell: { locale: Locales.EsMX },
      });
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
