import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { makeEn } from "../i18n/I18n.service";
import {
  makeInitialSearchFormViewModel,
  makeRetrySearchFormViewModel,
  SearchForm,
  SearchFormViewModel,
} from "./SearchForm";

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

describe("SearchForm", () => {
  it("renders form copy from the model", () => {
    const model = SearchFormViewModel.make({
      value: "1",
      label: "Sith id",
      submitLabel: "Find them",
      pendingLabel: "Searching...",
    });

    const idle = renderToStaticMarkup(
      <SearchForm {...model} dispatch={() => {}}
          onValueChange={() => {}}
          onSubmit={() => {}} isPending={false} />,
    );
    expect(idle).toContain("Sith id");
    expect(idle).toContain("Find them");

    const pending = renderToStaticMarkup(
      <SearchForm {...model} dispatch={() => {}}
          onValueChange={() => {}}
          onSubmit={() => {}} isPending={true} />,
    );
    expect(pending).toContain("Searching...");
    expect(pending).not.toContain("Find them");
  });

  it("renders a form error from the model", () => {
    const model = SearchFormViewModel.make({
      value: "abc",
      error: "Character id must be a positive whole number.",
      label: "Character id",
      submitLabel: "Load character",
      pendingLabel: "Loading...",
    });

    const html = renderToStaticMarkup(
      <SearchForm {...model} dispatch={() => {}}
          onValueChange={() => {}}
          onSubmit={() => {}} isPending={false} />,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("Character id must be a positive whole number.");
  });
});
