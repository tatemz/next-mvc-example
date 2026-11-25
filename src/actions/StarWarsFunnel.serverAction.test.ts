import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect, vi } from "vitest";

vi.mock("../server/Runtime", async () => {
  const { Effect, Layer, ManagedRuntime } = await import("effect");
  const { layer: i18nLayer } = await import("../i18n/I18n.service");
  const { layerStub } = await import("../services/SwapiPeopleCatalog.layer");
  const { luke, makeCharacterId } = await import(
    "../domain/FilmUniverse.fixture"
  );

  const runtime = ManagedRuntime.make(
    Layer.mergeAll(
      i18nLayer,
      layerStub(
        () => Effect.succeed(luke),
        () =>
          Effect.succeed([
            {
              _tag: "PersonSummary",
              id: makeCharacterId("1"),
              name: "Luke Skywalker",
            },
          ]),
      ),
    ),
  );

  return { swapiRuntime: runtime };
});

import { makeFunnelSearchViewModel } from "../components/FunnelView";
import { makeEn } from "../i18n/I18n.service";
import { makeAppShellViewModel } from "../components/AppShell";
import { submitStarWarsFunnel } from "./StarWarsFunnel.serverAction";

describe("submitStarWarsFunnel server action", () => {
  it.effect("runs the funnel controller through the runtime", () =>
    Effect.gen(function*() {
      const formData = new FormData();
      formData.set("query", "Luke");

      const result = yield* Effect.promise(() =>
        submitStarWarsFunnel((() => {
        const i18n = makeEn();
        return makeFunnelSearchViewModel(
          i18n,
          makeAppShellViewModel(i18n, "night"),
          "",
          undefined,
        );
      })(), formData),
      );

      expect(result).toMatchObject({
        _tag: "Choose",
        results: [{ name: "Luke Skywalker" }],
      });
    }),
  );
});
