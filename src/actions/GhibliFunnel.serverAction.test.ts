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
import { submitGhibliFunnel } from "./GhibliFunnel.serverAction";

const context = renderContext(catalogOf([haku]));

describe("submitGhibliFunnel server action", () => {
  it.effect("runs the shared funnel controller against the Ghibli catalog", () =>
    Effect.gen(function*() {
      const formData = new FormData();
      formData.set("query", "Haku");

      const i18n = makeEn();
      const previous = makeFunnelSearchViewModel(
        i18n,
        makeAppShellViewModel(i18n, "autumn"),
        "",
        undefined,
      );

      const result = yield* Effect.promise(() =>
        runInRenderContext(
          context, () => submitGhibliFunnel(previous, formData))
      );

      expect(result).toMatchObject({
        _tag: "Choose",
        results: [{ name: "Haku" }],
      });
    }));
});
