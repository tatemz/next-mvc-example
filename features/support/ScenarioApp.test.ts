import { it } from "@effect/vitest";
import { Option } from "effect";
import { describe, expect } from "vitest";
import { parseServerPort } from "./ScenarioApp";

describe("parseServerPort", () => {
  it("reads the port from the server's local url", () => {
    expect(
      parseServerPort("- Local:         http://localhost:64480"),
    ).toEqual(Option.some(64480));
  });

  it("ignores the network url and other startup lines", () => {
    expect(
      parseServerPort("- Network:       http://192.168.0.61:64480"),
    ).toEqual(Option.none());
    expect(parseServerPort("✓ Ready in 96ms")).toEqual(Option.none());
  });

  it("tolerates color codes around the line", () => {
    expect(
      parseServerPort("\u001b[36m- Local:         http://[::1]:3000\u001b[0m"),
    ).toEqual(Option.some(3000));
  });
});
