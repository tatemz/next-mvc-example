import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { SearchFormViewModel } from "./SearchForm.model";
import { SearchForm } from "./SearchForm.view";

describe("SearchForm", () => {
  it("renders form copy from the model", () => {
    const model = SearchFormViewModel.make({
      value: "1",
      label: "Sith id",
      submitLabel: "Find them",
      pendingLabel: "Searching...",
    });

    const idle = renderToStaticMarkup(
      <SearchForm {...model} dispatch={() => {}} isPending={false} />,
    );
    expect(idle).toContain("Sith id");
    expect(idle).toContain("Find them");

    const pending = renderToStaticMarkup(
      <SearchForm {...model} dispatch={() => {}} isPending={true} />,
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
      <SearchForm {...model} dispatch={() => {}} isPending={false} />,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("Character id must be a positive whole number.");
  });
});
