import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import ResultsRoute from "./page";
import { StarWarsResultsPage } from "../../../src/page-modules/Results/StarWarsResults.page";

describe("Star Wars results route", () => {
  it("exposes the Star Wars results page", () => {
    expect(ResultsRoute).toBe(StarWarsResultsPage);
  });
});
