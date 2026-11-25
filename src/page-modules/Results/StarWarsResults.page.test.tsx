import { it } from "@effect/vitest";
import { Effect } from "effect";
import { isValidElement } from "react";
import { describe, expect } from "vitest";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { haku, luke } from "../../domain/FilmUniverse.fixture";
import { catalogOf } from "../../services/PeopleCatalog.fixture";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { StarWarsResultsPage } from "./StarWarsResults.page";

const context = renderContext(catalogOf([luke]));

const render = (searchParams: Record<string, string | ReadonlyArray<string>>) =>
  Effect.promise(() =>
    runInRenderContext(
          context,
      () => StarWarsResultsPage({ searchParams: Promise.resolve(searchParams) }),
    )
  );

describe("Results page", () => {
  it.effect("loads typed search params through the Star Wars catalog", () =>
    Effect.gen(function*() {
      const element = yield* render({
        character: "1",
        film: "4",
        transport: "starship-12",
      });

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement(element)) throw new Error("expected an element");
      expect(element.type).toBe(ConnectedResultsView);
      expect(element.props).toMatchObject({
        universe: "star-wars",
        model: {
          _tag: "Ready",
          person: { name: "Luke Skywalker" },
          transport: { key: "starship-12" },
          startOverHref: "/star-wars/funnel",
          homeHref: "/star-wars",
        },
      });
    }));

  it.effect("takes the first value of array search params", () =>
    Effect.gen(function*() {
      const element = yield* render({
        character: ["1"],
        film: ["4"],
        transport: ["none"],
      });

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement(element)) throw new Error("expected an element");
      expect(element.props).toMatchObject({
        universe: "star-wars",
        model: {
          _tag: "Ready",
          transport: null,
          startOverHref: "/star-wars/funnel",
          homeHref: "/star-wars",
        },
      });
    }));

  it.effect("renders a missing dossier when transport is absent", () =>
    Effect.gen(function*() {
      const element = yield* render({ character: "1", film: "4" });

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement(element)) throw new Error("expected an element");
      expect(element.props).toMatchObject({
        universe: "star-wars",
        model: {
          _tag: "Missing",
          startOverHref: "/star-wars/funnel",
        },
      });
    }));

  it.effect("renders a missing dossier when params do not decode", () =>
    Effect.gen(function*() {
      const element = yield* render({ character: "1" });

      expect(isValidElement(element)).toBe(true);
      if (!isValidElement(element)) throw new Error("expected an element");
      expect(element.props).toMatchObject({
        universe: "star-wars",
        model: {
          _tag: "Missing",
          startOverHref: "/star-wars/funnel",
        },
      });
    }));
});
