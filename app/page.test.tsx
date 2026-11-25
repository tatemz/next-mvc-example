import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { RootPage } from "../src/page-modules/Root/Root.page";
import RootRoute from "./page";

describe("root route", () => {
  it("exposes the root page", () => {
    expect(RootRoute).toBe(RootPage);
  });
});
