import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import { presentLoadedHomePage } from "../src/page-modules/HomePage/HomePage.presenter";
import { searchPerson } from "../src/page-modules/HomePage/SearchPerson.controller";
import { layerStub } from "../src/services/StarWarsClient.layer";
import { luke, personNamed } from "./fixtures/Person.fixture";

const form = (characterId: string) => {
  const data = new FormData();
  data.set("characterId", characterId);
  return data;
};

const previous = presentLoadedHomePage(luke);

describe("searchPerson", () => {
  it.effect("returns a failed view model for a non-numeric id", () =>
    Effect.gen(function*() {
      const model = yield* searchPerson(previous, form("abc"));

      expect(model).toMatchObject({
        _tag: "Failed",
        form: { characterId: "abc" },
        message: "Character id must be a positive whole number.",
      });
    }).pipe(Effect.provide(layerStub(() => Effect.succeed(luke)))),
  );

  it.effect("returns a failed view model for a zero id", () =>
    Effect.gen(function*() {
      const model = yield* searchPerson(previous, form("0"));

      expect(model._tag).toBe("Failed");
    }).pipe(Effect.provide(layerStub(() => Effect.succeed(luke)))),
  );

  it.effect("returns a failed view model for a missing id", () =>
    Effect.gen(function*() {
      const model = yield* searchPerson(previous, new FormData());

      expect(model).toMatchObject({
        _tag: "Failed",
        form: { characterId: "" },
        message: "Character id must be a positive whole number.",
      });
    }).pipe(Effect.provide(layerStub(() => Effect.succeed(luke)))),
  );

  it.effect("returns the updated loaded view model for a valid id", () =>
    Effect.gen(function*() {
      const model = yield* searchPerson(previous, form("3"));

      expect(model).toMatchObject({
        _tag: "Loaded",
        form: { characterId: "3" },
        person: { name: "Rey" },
      });
    }).pipe(
      Effect.provide(layerStub((id) => Effect.succeed(personNamed(id, "Rey")))),
    ),
  );
});
