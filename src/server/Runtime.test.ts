import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { ghibliRuntime, swapiRuntime } from "./Runtime";

describe("runtimes", () => {
  it("creates both dataset runtimes", () => {
    expect(swapiRuntime).toBeDefined();
    expect(ghibliRuntime).toBeDefined();
  });
});
