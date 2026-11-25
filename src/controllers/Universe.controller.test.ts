import { it } from "@effect/vitest";
import { Effect, Option } from "effect";
import { describe, expect } from "vitest";
import { tag } from "../platform/ParsedPathParams";
import { currentUniverse } from "./Universe.controller";

describe("currentUniverse", () => {
  it.effect("reads a valid universe", () =>
    Effect.gen(function*() {
      const universe = yield* currentUniverse.pipe(
        Effect.provideService(tag, { universe: "ghibli" }),
      );

      expect(universe).toEqual(Option.some("ghibli"));
    }));

  it.effect("returns none for an unknown universe", () =>
    Effect.gen(function*() {
      const universe = yield* currentUniverse.pipe(
        Effect.provideService(tag, { universe: "unknown" }),
      );

      expect(universe).toEqual(Option.none());
    }));
});
