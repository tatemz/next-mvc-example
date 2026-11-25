import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

import { notFound } from "next/navigation";
import { currentUniverse, tag } from "./ParsedPathParams";

describe("currentUniverse", () => {
  it.effect("reads a valid universe", () =>
    Effect.gen(function*() {
      const universe = yield* currentUniverse.pipe(
        Effect.provideService(tag, { universe: "ghibli" }),
      );

      expect(universe).toBe("ghibli");
    }));

  it.effect("renders not found for an unknown universe", () =>
    Effect.gen(function*() {
      const exit = yield* Effect.exit(
        currentUniverse.pipe(
          Effect.provideService(tag, { universe: "unknown" }),
        ),
      );

      expect(exit._tag).toBe("Failure");
      expect(notFound).toHaveBeenCalled();
    }));
});
