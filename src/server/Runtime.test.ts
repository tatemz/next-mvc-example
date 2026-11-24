import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { runtime } from "./Runtime";

describe("runtime", () => {
  it("creates the application runtime", () => {
    expect(runtime).toBeDefined();
  });
});
