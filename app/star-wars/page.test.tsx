import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { StarWarsHomePage } from "../../src/page-modules/HomePage/StarWarsHome.page";
import HomeRoute from "./page";

describe("Star Wars home route", () => {
  it("exposes the Star Wars home page", () => {
    expect(HomeRoute).toBe(StarWarsHomePage);
  });
});
