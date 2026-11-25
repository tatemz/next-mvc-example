import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { makeEn } from "../i18n/I18n.service";
import { NotFoundView, makeNotFoundViewModel } from "./NotFoundView";

describe("NotFoundView", () => {
  it("renders the not found message and home link", () => {
    const html = renderToStaticMarkup(
      <NotFoundView model={makeNotFoundViewModel(makeEn())} />,
    );

    expect(html).toContain("Page not found");
    expect(html).toContain("That universe does not exist.");
    expect(html).toContain('href="/"');
    expect(html).toContain("Back home");
  });
});
