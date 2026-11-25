import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect } from "vitest";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { haku, luke } from "../../domain/FilmUniverse.fixture";
import type { Person, Universe } from "../../domain/FilmUniverse.model";
import { catalogOf } from "../../services/PeopleCatalog.fixture";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { ResultsPage } from "./Results.page";

const render = (
  universe: Universe,
  searchParams: Readonly<Record<string, string>>,
  people: ReadonlyArray<Person>,
) =>
  Effect.promise(() =>
    runInRenderContext(renderContext(catalogOf(people)), () =>
      ResultsPage({
        params: Promise.resolve({ universe }),
        searchParams: Promise.resolve(searchParams),
      })
    )
  );

describe("Results page", () => {
  it.effect("loads a Star Wars dossier", () =>
    Effect.gen(function*() {
      const element = yield* render(
        "star-wars",
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
        shell: { universe: "star-wars", theme: "night" },
      });
    }));

  it.effect("loads a Ghibli dossier", () =>
    Effect.gen(function*() {
      const element = yield* render(
        "ghibli",
        { character: "1", film: "1", transport: "none" },
        [haku],
      );

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement<{ model: unknown }>(element)) {
        throw new Error("expected an element");
      }
      expect(element.props.model).toMatchObject({
        _tag: "Ready",
        person: { name: "Haku" },
        shell: { universe: "ghibli", theme: "autumn" },
        startOverHref: "/ghibli/funnel",
        homeHref: "/ghibli",
      });
    }));

  it.effect("renders a missing dossier when params do not decode", () =>
    Effect.gen(function*() {
      const element = yield* render(
        "star-wars",
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
