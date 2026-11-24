import { describe, expect, it } from "vitest";
import { runtime } from "../src/server/Runtime";

describe("runtime", () => {
  it("creates the application runtime", () => {
    expect(runtime).toBeDefined();
  });
});
