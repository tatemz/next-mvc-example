import { it } from "@effect/vitest";
import { Option } from "effect";
import { describe, expect } from "vitest";
import { parseNextStartPort } from "./ScenarioApp";

describe("parseNextStartPort", () => {
  it("reads the port from Next's local url", () => {
    expect(
      parseNextStartPort("- Local:         http://localhost:64480"),
    ).toEqual(Option.some(64480));
  });

  it("ignores the network url and other startup lines", () => {
    expect(
      parseNextStartPort("- Network:       http://192.168.0.61:64480"),
    ).toEqual(Option.none());
    expect(parseNextStartPort("✓ Ready in 96ms")).toEqual(Option.none());
  });

  it("tolerates color codes around the line", () => {
    expect(
      parseNextStartPort("\u001b[36m- Local:         http://[::1]:3000\u001b[0m"),
    ).toEqual(Option.some(3000));
  });
});
