import { Schema } from "effect";
import { describe, expect, it } from "vitest";
import { CharacterId } from "../src/domain/CharacterId.model";

describe("CharacterId", () => {
  it("accepts a positive whole number written as a string", () => {
    expect(Schema.decodeUnknownSync(CharacterId)("3")).toBe("3");
  });

  it("normalizes a numeric id to its canonical string", () => {
    expect(Schema.decodeUnknownSync(CharacterId)("01")).toBe("1");
  });

  it("rejects zero", () => {
    expect(() => Schema.decodeUnknownSync(CharacterId)("0")).toThrow();
  });

  it("rejects a non-numeric id", () => {
    expect(() => Schema.decodeUnknownSync(CharacterId)("abc")).toThrow();
  });
});
