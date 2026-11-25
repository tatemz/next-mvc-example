import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { HomePage } from "../../src/page-modules/Home/Home.page";
import HomeRoute from "./page";

describe("universe home route", () => {
  it("exposes the home page", () => {
    expect(HomeRoute).toBe(HomePage);
  });
});
