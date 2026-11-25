import { Universes } from "../domain/FilmUniverse.model";
import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import { makeFunnelSearchViewModel } from "../components/FunnelView";
import { haku, luke } from "../domain/FilmUniverse.fixture";
import { FunnelFields } from "../forms/FunnelForm";
import type { Person, Universe } from "../domain/FilmUniverse.model";
import { makeEn } from "../i18n/I18n.service";
import { catalogOf } from "../services/PeopleCatalog.fixture";
import { runInRenderContext } from "../server/RenderContext";
import { renderContext } from "../server/RenderContext.fixture";
import { submitFunnel } from "./Funnel.serverAction";

const run = (
  universe: Universe,
  query: string,
  people: ReadonlyArray<Person>,
) =>
  Effect.gen(function*() {
    const formData = new FormData();
    formData.set(FunnelFields.Query, query);

    const previous = makeFunnelSearchViewModel(
      makeEn(),
      universe,
      "",
      undefined,
    );

    return yield* Effect.promise(() =>
      runInRenderContext(
        renderContext(catalogOf(people)),
        () => submitFunnel(previous, formData),
      )
    );
  });

describe("submitFunnel server action", () => {
  it.effect("runs against the Star Wars catalog", () =>
    Effect.gen(function*() {
      const result = yield* run(Universes.StarWars, "Luke", [luke]);

      expect(result).toMatchObject({
        _tag: "Choose",
        results: [{ name: "Luke Skywalker" }],
      });
    }));

  it.effect("runs against the Ghibli catalog", () =>
    Effect.gen(function*() {
      const result = yield* run(Universes.Ghibli, "Haku", [haku]);

      expect(result).toMatchObject({
        _tag: "Choose",
        results: [{ name: "Haku" }],
      });
    }));
});
