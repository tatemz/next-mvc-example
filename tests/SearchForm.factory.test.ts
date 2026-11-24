import { describe, expect, it } from "vitest";
import {
  makeInitialSearchFormViewModel,
  makeRetrySearchFormViewModel,
} from "../src/components/SearchForm/SearchForm.factory";
import { makeEn } from "../src/i18n/I18n.service";

const i18n = makeEn();

describe("makeInitialSearchFormViewModel", () => {
  it("builds the initial form", () => {
    expect(makeInitialSearchFormViewModel(i18n, "3")).toEqual({
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
    expect(makeRetrySearchFormViewModel(i18n, "abc")).toEqual({
      _tag: "SearchFormViewModel",
      value: "abc",
      label: "Character id",
      submitLabel: "Try again",
      pendingLabel: "Loading...",
    });
  });
});
