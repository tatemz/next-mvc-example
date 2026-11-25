import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { ResultsPage } from "../../../../src/page-modules/Results/Results.page";
import ResultsRoute from "./page";

describe("universe results route", () => {
  it("exposes the results page", () => {
    expect(ResultsRoute).toBe(ResultsPage);
  });
});
