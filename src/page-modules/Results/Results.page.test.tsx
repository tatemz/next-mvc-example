import { ExperienceThemes } from "../../components/AppShell";
import { Universes, NoTransportKey } from "../../domain/FilmUniverse.model";
import { Locales } from "../../i18n/Locale";
import { it } from "@effect/vitest";
import { Effect, Match } from "effect";
import { isValidElement } from "react";
import { describe, expect } from "vitest";
import type { ResultsViewModel } from "../../components/ResultsView";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import {
  NotFoundView,
  type NotFoundViewModel,
} from "../../components/NotFoundView";
import { haku, luke } from "../../domain/FilmUniverse.fixture";
import type { Person } from "../../domain/FilmUniverse.model";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { ResultsPage } from "./Results.page";

const catalogsFor = (
  universe: string,
  people: ReadonlyArray<Person>,
) =>
  universe === Universes.Ghibli ? { ghibli: people } : { starWars: people };

const pathParams = (
  universe: string,
  locale?: string,
): Record<string, string> =>
  locale === undefined ? { universe } : { locale, universe };

const render = (
  universe: string,
  searchParams: Readonly<Record<string, string>>,
  people: ReadonlyArray<Person>,
  locale?: string,
) =>
  Effect.promise(() =>
    runInRenderContext(renderContext(catalogsFor(universe, people)), () =>
      ResultsPage({
        params: Promise.resolve(pathParams(universe, locale)),
        searchParams: Promise.resolve(searchParams),
      })
    )
  );

describe("Results page", () => {
  it.effect("loads a Star Wars dossier", () =>
    Effect.gen(function*() {
      const element = yield* render(
        Universes.StarWars,
        { character: "1", film: "4", transport: "starship-12" },
        [luke],
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement<{ model: unknown }>(element)) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(ConnectedResultsView);
      expect(element.props.model).toMatchObject({
        _tag: "Ready",
        person: { name: "Luke Skywalker" },
        film: { order: 4 },
        transport: { key: "starship-12" },
        startOverHref: "/star-wars/funnel",
        homeHref: "/star-wars",
        shell: { universe: Universes.StarWars, theme: ExperienceThemes.Night },
      });
    }));

  it.effect("renders not found for an unknown universe", () =>
    Effect.gen(function*() {
      const element = yield* render("unknown", {}, [luke]);

      expect(isValidElement(element)).toBe(true);
      if (
        !isValidElement<{ model: ResultsViewModel | NotFoundViewModel }>(
          element,
        )
      ) {
        throw new Error("expected an element");
      }
      expect(element.type).toBe(NotFoundView);
      expect(
        Match.valueTags(element.props.model, {
          NotFoundViewModel: () => true,
          Ready: () => false,
          Missing: () => false,
        }),
      ).toBe(true);
    }));

  it.effect("loads a Spanish dossier", () =>
    Effect.gen(function*() {
      const element = yield* render(
        Universes.Ghibli,
        { character: "1", film: "1", transport: NoTransportKey },
        [haku],
        Locales.EsMX,
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement<{ model: unknown }>(element)) {
        throw new Error("expected an element");
      }
      expect(element.props.model).toMatchObject({
        _tag: "Ready",
        person: { name: "Haku" },
        shell: { locale: Locales.EsMX },
        startOverHref: "/es-MX/ghibli/funnel",
        homeHref: "/es-MX/ghibli",
      });
    }));

  it.effect("loads a Ghibli dossier", () =>
    Effect.gen(function*() {
      const element = yield* render(
        Universes.Ghibli,
        { character: "1", film: "1", transport: NoTransportKey },
        [haku],
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement<{ model: unknown }>(element)) {
        throw new Error("expected an element");
      }
      expect(element.props.model).toMatchObject({
        _tag: "Ready",
        person: { name: "Haku" },
        shell: { universe: Universes.Ghibli, theme: ExperienceThemes.Autumn },
        startOverHref: "/ghibli/funnel",
        homeHref: "/ghibli",
      });
    }));

  it.effect("renders a missing dossier when params do not decode", () =>
    Effect.gen(function*() {
      const element = yield* render(
        Universes.StarWars,
        { character: "1" },
        [luke],
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement<{ model: unknown }>(element)) {
        throw new Error("expected an element");
      }
      expect(element.props.model).toMatchObject({
        _tag: "Missing",
        startOverHref: "/star-wars/funnel",
      });
    }));
});
