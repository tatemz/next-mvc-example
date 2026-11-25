import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { GhibliHomePage } from "../../src/page-modules/HomePage/GhibliHome.page";
import HomeRoute from "./page";

describe("Ghibli home route", () => {
  it("exposes the Ghibli home page", () => {
    expect(HomeRoute).toBe(GhibliHomePage);
  });
});
