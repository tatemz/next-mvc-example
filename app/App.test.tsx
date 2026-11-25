import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import RootLayout from "./layout";

describe("app", () => {
  it("keeps the root layout to html and body", () => {
    const html = renderToStaticMarkup(
      RootLayout({ children: <p>child</p> }),
    );

    expect(html).toContain('<html lang="en">');
    expect(html).toContain("<body>");
    expect(html).toContain("<p>child</p>");
    expect(html).not.toContain("Character Dossier");
  });
});
