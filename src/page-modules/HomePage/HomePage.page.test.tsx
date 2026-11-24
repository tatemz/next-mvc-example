import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect, vi } from "vitest";

vi.mock("../../server/Runtime", async () => {
  const { ConfigProvider, Effect, Layer, ManagedRuntime } = await import(
    "effect"
  );
  const { layer: i18nLayer } = await import("../../i18n/I18n.service");
  const { layerStub } = await import("../../services/StarWarsClient.layer");
  const { personNamed } = await import("../../domain/StarWars.fixture");

  const runtime = ManagedRuntime.make(
    Layer.mergeAll(
      i18nLayer,
      layerStub((id) => Effect.succeed(personNamed(id, "Runtime"))),
      Layer.succeed(
        ConfigProvider.ConfigProvider,
        ConfigProvider.fromEnv({ env: { STAR_WARS_CHARACTER_ID: "3" } }),
      ),
    ),
  );

  return { runtime };
});

import { HomePage } from "./HomePage.page";

describe("HomePage page", () => {
  it.effect("loads the model through the runtime", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() => HomePage());

      expect(element.props).toMatchObject({
        _tag: "Loaded",
        form: { value: "3" },
        person: { name: "Runtime" },
      });
    }),
  );
});
