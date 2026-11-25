import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import { makeAppShellViewModel } from "../components/AppShell";
import { makeFunnelSearchViewModel } from "../components/FunnelView";
import { haku, luke } from "../domain/FilmUniverse.fixture";
import { makeEn } from "../i18n/I18n.service";
import { catalogOf } from "../services/PeopleCatalog.fixture";
import { runInRenderContext } from "../server/RenderContext";
import { renderContext } from "../server/RenderContext.fixture";
import { submitStarWarsFunnel } from "./StarWarsFunnel.serverAction";

const context = renderContext(catalogOf([luke]));

describe("submitStarWarsFunnel server action", () => {
  it.effect("runs the funnel controller against the Star Wars catalog", () =>
    Effect.gen(function*() {
      const formData = new FormData();
      formData.set("query", "Luke");

      const i18n = makeEn();
      const previous = makeFunnelSearchViewModel(
        i18n,
        makeAppShellViewModel(i18n, "star-wars"),
        "",
        undefined,
      );

      const result = yield* Effect.promise(() =>
        runInRenderContext(
          context, () =>
          submitStarWarsFunnel(previous, formData)
        )
      );

      expect(result).toMatchObject({
        _tag: "Choose",
        results: [{ name: "Luke Skywalker" }],
      });
    }));
});
