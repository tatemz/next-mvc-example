import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { ghibliRuntime, shellRuntime, swapiRuntime } from "./Runtime";

describe("runtimes", () => {
  it("creates the shell and both dataset runtimes", () => {
    expect(shellRuntime).toBeDefined();
    expect(swapiRuntime).toBeDefined();
    expect(ghibliRuntime).toBeDefined();
  });
});
