import { describe, expect, it } from "vitest";
import { makeSearchFormViewModel } from "../src/components/SearchForm/SearchForm.factory";

describe("makeSearchFormViewModel", () => {
  it("puts the submitted id and the form copy in the form model", () => {
    expect(makeSearchFormViewModel("abc")).toEqual({
      _tag: "SearchFormViewModel",
      characterId: "abc",
      label: "Character id",
      submitLabel: "Load character",
      pendingLabel: "Loading...",
    });
  });
});
