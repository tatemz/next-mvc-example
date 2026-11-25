import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { getStringOrEmpty, toRecord } from "./FormData";

describe("FormData", () => {
  it("converts entries into a record", () => {
    const formData = new FormData();
    formData.set("characterId", "3");
    formData.set("file", new File(["x"], "f.txt"));

    expect(toRecord(formData)).toEqual({
      characterId: "3",
      file: "f.txt",
    });
  });

  it("reads a string or an empty value", () => {
    expect(getStringOrEmpty("characterId")({ characterId: "3" })).toBe("3");
    expect(getStringOrEmpty("characterId")({})).toBe("");
  });
});
