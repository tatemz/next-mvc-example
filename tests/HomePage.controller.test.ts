import { it } from "@effect/vitest";
import { ConfigProvider, Effect } from "effect";
import { describe, expect } from "vitest";
import { loadHomePage } from "../src/page-modules/HomePage/HomePage.controller";
import { StarWarsError } from "../src/services/StarWarsClient";
import { layerStub } from "../src/services/StarWarsClient.layer";
import { luke, personNamed } from "./fixtures/Person.fixture";

const env = (values: Record<string, string>) =>
  ConfigProvider.fromEnv({ env: values });

describe("loadHomePage", () => {
  it.effect("reads the default character id from Config", () =>
    Effect.gen(function*() {
      const model = yield* loadHomePage;

      expect(model._tag).toBe("Loaded");
      if (model._tag !== "Loaded") throw new Error("expected Loaded");
      expect(model.form.characterId).toBe("2");
      expect(model.person.name).toBe("Leia Organa");
    }).pipe(
      Effect.provide(
        layerStub((id) => Effect.succeed(personNamed(id, "Leia Organa"))),
      ),
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        env({ STAR_WARS_CHARACTER_ID: "2" }),
      ),
    ),
  );

  it.effect("falls back to character one", () =>
    Effect.gen(function*() {
      const model = yield* loadHomePage;

      expect(model._tag).toBe("Loaded");
      if (model._tag !== "Loaded") throw new Error("expected Loaded");
      expect(model.form.characterId).toBe("1");
    }).pipe(
      Effect.provide(layerStub(() => Effect.succeed(luke))),
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        env({}),
      ),
    ),
  );

  it.effect("turns a client failure into a failed view model", () =>
    Effect.gen(function*() {
      const model = yield* loadHomePage;

      expect(model).toMatchObject({
        _tag: "Failed",
        form: { characterId: "1" },
        message: "Person 1 is not available.",
      });
    }).pipe(
      Effect.provide(
        layerStub(() =>
          Effect.fail(new StarWarsError({ message: "Person 1 is not available." })),
        ),
      ),
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        env({}),
      ),
    ),
  );

  it.effect("turns an invalid configured id into a failed view model", () =>
    Effect.gen(function*() {
      const model = yield* loadHomePage;

      expect(model).toMatchObject({
        _tag: "Failed",
        form: { characterId: "" },
      });
    }).pipe(
      Effect.provide(layerStub(() => Effect.succeed(luke))),
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        env({ STAR_WARS_CHARACTER_ID: "abc" }),
      ),
    ),
  );
});
