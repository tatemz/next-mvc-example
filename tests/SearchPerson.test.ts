import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import { presentLoadedHomePage } from "../src/controllers/HomePage.controller";
import { searchPerson } from "../src/controllers/SearchPerson.controller";
import { I18n, makeEn } from "../src/i18n/I18n.service";
import { layerStub } from "../src/services/StarWarsClient.layer";
import { luke, personNamed } from "./fixtures/Person.fixture";

const form = (characterId: string) => {
  const data = new FormData();
  data.set("characterId", characterId);
  return data;
};

const i18n = makeEn();
const previous = presentLoadedHomePage(i18n, luke);

describe("searchPerson", () => {
  it.effect("sets a form error on the current model for a non-numeric id", () =>
    Effect.gen(function*() {
      const model = yield* searchPerson(previous, form("abc"));

      expect(model).toMatchObject({
        _tag: "Loaded",
        form: {
          value: "abc",
          error: "Character id must be a positive whole number.",
        },
        person: { name: "Luke Skywalker" },
      });
      expect(previous.form.error).toBeUndefined();
    }).pipe(
      Effect.provide(layerStub(() => Effect.succeed(luke))),
      Effect.provideService(I18n, i18n),
    ),
  );

  it.effect("sets a form error on the current model for a zero id", () =>
    Effect.gen(function*() {
      const model = yield* searchPerson(previous, form("0"));

      expect(model).toMatchObject({
        _tag: "Loaded",
        form: {
          value: "0",
          error: "Character id must be a positive whole number.",
        },
      });
    }).pipe(
      Effect.provide(layerStub(() => Effect.succeed(luke))),
      Effect.provideService(I18n, i18n),
    ),
  );

  it.effect("sets a form error on the current model for a missing id", () =>
    Effect.gen(function*() {
      const model = yield* searchPerson(previous, new FormData());

      expect(model).toMatchObject({
        _tag: "Loaded",
        form: {
          value: "",
          error: "Character id must be a positive whole number.",
        },
      });
    }).pipe(
      Effect.provide(layerStub(() => Effect.succeed(luke))),
      Effect.provideService(I18n, i18n),
    ),
  );

  it.effect("returns the updated loaded view model for a valid id", () =>
    Effect.gen(function*() {
      const model = yield* searchPerson(previous, form("3"));

      expect(model).toMatchObject({
        _tag: "Loaded",
        form: { value: "3" },
        person: { name: "Rey" },
      });
    }).pipe(
      Effect.provide(layerStub((id) => Effect.succeed(personNamed(id, "Rey")))),
      Effect.provideService(I18n, i18n),
    ),
  );
});
