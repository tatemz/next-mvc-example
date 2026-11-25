import { it } from "@effect/vitest";
import { ConfigProvider, Effect } from "effect";
import { describe, expect } from "vitest";
import { loadHomePage } from "./HomePage.controller";
import { I18n, makeEn } from "../i18n/I18n.service";
import { PeopleCatalogError } from "../services/PeopleCatalog";
import { layerStub } from "../services/SwapiPeopleCatalog.layer";
import { luke, personNamed } from "../domain/FilmUniverse.fixture";

const env = (values: Record<string, string>) =>
  ConfigProvider.fromEnv({ env: values });

const i18n = makeEn();

describe("loadHomePage", () => {
  it.effect("reads the character id from Config", () =>
    Effect.gen(function*() {
      const model = yield* loadHomePage("/star-wars/funnel", "night");

      expect(model._tag).toBe("Loaded");
      if (model._tag !== "Loaded") throw new Error("expected Loaded");
      expect(model.form.value).toBe("2");
      expect(model.person.name).toBe("Leia Organa");
      expect(model.hero.funnelHref).toBe("/star-wars/funnel");
    }).pipe(
      Effect.provide(
        layerStub((id) => Effect.succeed(personNamed(id, "Leia Organa"))),
      ),
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        env({ CHARACTER_ID: "2" }),
      ),
      Effect.provideService(I18n, i18n),
    ),
  );

  it.effect("renders a failed page when CHARACTER_ID is missing", () =>
    Effect.gen(function*() {
      const model = yield* loadHomePage("/star-wars/funnel", "night");

      expect(model).toMatchObject({
        _tag: "Failed",
        form: { value: "" },
      });
    }).pipe(
      Effect.provide(layerStub(() => Effect.succeed(luke))),
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        env({}),
      ),
      Effect.provideService(I18n, i18n),
    ),
  );

  it.effect("turns a client failure into a failed view model", () =>
    Effect.gen(function*() {
      const model = yield* loadHomePage("/star-wars/funnel", "night");

      expect(model).toMatchObject({
        _tag: "Failed",
        form: { value: "1" },
        message: "The character could not be loaded.",
      });
    }).pipe(
      Effect.provide(
        layerStub(() =>
          Effect.fail(new PeopleCatalogError({ message: "Person 1 is not available." })),
        ),
      ),
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        env({ CHARACTER_ID: "1" }),
      ),
      Effect.provideService(I18n, i18n),
    ),
  );

  it.effect("turns an invalid configured id into a failed view model", () =>
    Effect.gen(function*() {
      const model = yield* loadHomePage("/star-wars/funnel", "night");

      expect(model).toMatchObject({
        _tag: "Failed",
        form: { value: "" },
      });
    }).pipe(
      Effect.provide(layerStub(() => Effect.succeed(luke))),
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        env({ CHARACTER_ID: "abc" }),
      ),
      Effect.provideService(I18n, i18n),
    ),
  );
});
