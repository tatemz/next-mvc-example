import { it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { describe, expect } from "vitest";
import { makeLoadedHomePageModel } from "../src/components/HomePage/factory";
import { searchPerson } from "../src/controllers/searchPerson.controller";
import { StarWarsClient } from "../src/services/StarWarsClient";
import { luke, personNamed } from "./fixtures/person";

const clientLayer = (getPerson: StarWarsClient["Service"]["getPerson"]) =>
  Layer.succeed(StarWarsClient, StarWarsClient.of({ getPerson }));

const form = (characterId: string) => {
  const data = new FormData();
  data.set("characterId", characterId);
  return data;
};

const previous = makeLoadedHomePageModel(luke);

describe("searchPerson", () => {
  it.effect("returns a failed view model for a non-numeric id", () =>
    Effect.gen(function*() {
      const model = yield* searchPerson(previous, form("abc"));

      expect(model).toMatchObject({
        _tag: "Failed",
        form: { characterId: "abc" },
        message: "Character id must be a positive whole number.",
      });
    }).pipe(Effect.provide(clientLayer(() => Effect.succeed(luke)))),
  );

  it.effect("returns a failed view model for a zero id", () =>
    Effect.gen(function*() {
      const model = yield* searchPerson(previous, form("0"));

      expect(model._tag).toBe("Failed");
    }).pipe(Effect.provide(clientLayer(() => Effect.succeed(luke)))),
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
      Effect.provide(clientLayer((id) => Effect.succeed(personNamed(id, "Rey")))),
    ),
  );
});
