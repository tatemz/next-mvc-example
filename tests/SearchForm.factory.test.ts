import { describe, expect, it } from "vitest";
import {
  makeInitialSearchFormViewModel,
  makeRetrySearchFormViewModel,
} from "../src/components/SearchForm/SearchForm.factory";

describe("makeInitialSearchFormViewModel", () => {
  it("builds the initial form", () => {
    expect(makeInitialSearchFormViewModel("3")).toEqual({
      _tag: "SearchFormViewModel",
      value: "3",
      label: "Character id",
      submitLabel: "Load character",
      pendingLabel: "Loading...",
    });
  });
});

describe("makeRetrySearchFormViewModel", () => {
  it("builds the retry form", () => {
    expect(makeRetrySearchFormViewModel("abc")).toEqual({
      _tag: "SearchFormViewModel",
      value: "abc",
      label: "Character id",
      submitLabel: "Try again",
      pendingLabel: "Loading...",
    });
  });
});
