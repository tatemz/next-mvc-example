import { renderToStaticMarkup } from "react-dom/server";
import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import RootLayout from "./layout";
import Page from "./page";
import GhibliPage from "./ghibli/page";
import StarWarsPage from "./star-wars/page";

describe("app", () => {
  it("redirects the root to the Star Wars page", () => {
    expect(() => Page()).toThrow();
  });

  it("exposes each dataset page", () => {
    expect(typeof StarWarsPage).toBe("function");
    expect(typeof GhibliPage).toBe("function");
  });

  it("renders children inside the document", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <p>child</p>
      </RootLayout>,
    );

    expect(html).toContain('<html lang="en" data-theme="night">');
    expect(html).toContain("<p>child</p>");
  });
});
