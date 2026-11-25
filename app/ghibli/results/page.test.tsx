import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import ResultsRoute from "./page";
import { GhibliResultsPage } from "../../../src/page-modules/Results/GhibliResults.page";

describe("Ghibli results route", () => {
  it("exposes the Ghibli results page", () => {
    expect(ResultsRoute).toBe(GhibliResultsPage);
  });
});
