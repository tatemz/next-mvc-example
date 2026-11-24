import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import {
  makeInitialSearchFormViewModel,
  makeRetrySearchFormViewModel,
} from "./SearchForm.factory";
import { makeEn } from "../../i18n/I18n.service";

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
