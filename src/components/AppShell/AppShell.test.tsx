import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { makeEn } from "../../i18n/I18n.service";
import { AppShell, makeAppShellViewModel } from "./AppShell";

const i18n = makeEn();

describe("makeAppShellViewModel", () => {
  it("builds the brand and dataset links", () => {
    expect(makeAppShellViewModel(i18n)).toEqual({
      _tag: "AppShellViewModel",
      brand: {
        _tag: "AppShellLinkViewModel",
        label: "Character Dossier",
        href: "/",
      },
      links: [
        {
          _tag: "AppShellLinkViewModel",
          label: "Star Wars",
          href: "/star-wars",
        },
        {
          _tag: "AppShellLinkViewModel",
          label: "Ghibli",
          href: "/ghibli",
        },
      ],
    });
  });
});

describe("AppShell", () => {
  it("renders the shared frame around children", () => {
    const html = renderToStaticMarkup(
      <AppShell {...makeAppShellViewModel(i18n)}>
        <p>child</p>
      </AppShell>,
    );

    expect(html).toContain("Character Dossier");
    expect(html).toContain('href="/star-wars"');
    expect(html).toContain('href="/ghibli"');
    expect(html).toContain("<p>child</p>");
  });
});
