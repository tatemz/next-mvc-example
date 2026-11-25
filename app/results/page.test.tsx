import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import ResultsRoute from "./page";
import { ResultsPage } from "../../src/page-modules/Results/Results.page";

describe("results route", () => {
  it("exposes the Results page module", () => {
    expect(ResultsRoute).toBe(ResultsPage);
  });
});
