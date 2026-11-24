import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect, vi } from "vitest";

vi.mock("../server/Runtime", async () => {
  const { Effect, Layer, ManagedRuntime } = await import("effect");
  const { layer: i18nLayer } = await import("../i18n/I18n.service");
  const { layerStub } = await import("../services/StarWarsClient.layer");
  const { luke, makeCharacterId } = await import(
    "../domain/StarWars.fixture"
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

  return { runtime };
});

import { makeFunnelSearchViewModel } from "../components/Funnel/Funnel";
import { makeEn } from "../i18n/I18n.service";
import { submitFunnel } from "./Funnel.serverAction";

describe("submitFunnel server action", () => {
  it.effect("runs the funnel controller through the runtime", () =>
    Effect.gen(function*() {
      const formData = new FormData();
      formData.set("query", "Luke");

      const result = yield* Effect.promise(() =>
        submitFunnel(makeFunnelSearchViewModel(makeEn()), formData),
      );

      expect(result).toMatchObject({
        _tag: "Choose",
        results: [{ name: "Luke Skywalker" }],
      });
    }),
  );
});
