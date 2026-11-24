import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import ResultsRoute from "./page";
import { ResultsPage } from "../../src/page-modules/Results/Results.page";

describe("results route", () => {
  it.effect("passes the awaited search params to the Results page", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        ResultsRoute({
          searchParams: Promise.resolve({
            character: "1",
            film: "4",
          }),
        }),
      );

      expect(element.type).toBe(ResultsPage);
      expect(element.props).toEqual({
        searchParams: { character: "1", film: "4" },
      });
    }));
});
