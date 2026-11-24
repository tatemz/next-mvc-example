import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RootLayout from "../app/layout";
import Page from "../app/page";
import { HomePage } from "../src/page-modules/HomePage/HomePage.page";

describe("app", () => {
  it("exposes the HomePage page as the route", () => {
    expect(Page).toBe(HomePage);
  });

  it("renders children inside the document", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <p>child</p>
      </RootLayout>,
    );

    expect(html).toContain('<html lang="en">');
    expect(html).toContain("<p>child</p>");
  });
});
