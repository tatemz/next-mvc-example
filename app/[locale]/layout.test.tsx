import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { Locales } from "../../src/i18n/Locale";
import RootLayout from "./layout";

describe("app", () => {
  it("sets the document language from the locale", async () => {
    const html = renderToStaticMarkup(
      await RootLayout({
        children: <p>child</p>,
        params: Promise.resolve({ locale: Locales.EsMX }),
      }),
    );

    expect(html).toContain(`<html lang="${Locales.EsMX}">`);
    expect(html).toContain("<body>");
    expect(html).toContain("<p>child</p>");
    expect(html).not.toContain("Dossier de personaje");
  });

  it("defaults the document language to US English", async () => {
    const html = renderToStaticMarkup(
      await RootLayout({
        children: <p>child</p>,
        params: Promise.resolve({}),
      }),
    );

    expect(html).toContain(`<html lang="${Locales.EnUS}">`);
  });
});
