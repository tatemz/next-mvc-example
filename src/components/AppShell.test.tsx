import { ExperienceThemes } from "./AppShell";
import { Universes } from "../domain/FilmUniverse.model";
import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { makeEn, makeEs } from "../i18n/I18n.service";
import { Locales } from "../i18n/Locale";
import { AppShell, makeAppShellViewModel } from "./AppShell";

const i18n = makeEn();

describe("makeAppShellViewModel", () => {
  it("builds the theme, brand, and dataset links", () => {
    expect(makeAppShellViewModel(i18n, Universes.Ghibli)).toEqual({
      _tag: "AppShellViewModel",
      locale: Locales.EnUS,
      universe: Universes.Ghibli,
      theme: ExperienceThemes.Autumn,
      brand: {
        _tag: "AppShellLinkViewModel",
        label: "Character Dossier",
        href: "/",
      },
      localeSwitch: {
        _tag: "AppShellLinkViewModel",
        label: "Español",
        href: "/es-MX/ghibli",
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

  it("builds Spanish links with the locale prefix", () => {
    expect(makeAppShellViewModel(makeEs(), Universes.StarWars)).toEqual({
      _tag: "AppShellViewModel",
      locale: Locales.EsMX,
      universe: Universes.StarWars,
      theme: ExperienceThemes.Night,
      brand: {
        _tag: "AppShellLinkViewModel",
        label: "Dossier de personaje",
        href: "/es-MX",
      },
      localeSwitch: {
        _tag: "AppShellLinkViewModel",
        label: "English",
        href: "/star-wars",
      },
      links: [
        {
          _tag: "AppShellLinkViewModel",
          label: "Star Wars",
          href: "/es-MX/star-wars",
        },
        {
          _tag: "AppShellLinkViewModel",
          label: "Ghibli",
          href: "/es-MX/ghibli",
        },
      ],
    });
  });
});

describe("AppShell", () => {
  it("renders the shared frame around children", () => {
    const html = renderToStaticMarkup(
      <AppShell {...makeAppShellViewModel(i18n, Universes.StarWars)}>
        <p>child</p>
      </AppShell>,
    );

    expect(html).toContain(`data-theme="${ExperienceThemes.Night}"`);
    expect(html).toContain("Character Dossier");
    expect(html).toContain('href="/star-wars"');
    expect(html).toContain('href="/ghibli"');
    expect(html).toContain('href="/es-MX/star-wars"');
    expect(html).toContain("Español");
    expect(html).toContain("<p>child</p>");
  });

  it("renders the Spanish frame", () => {
    const html = renderToStaticMarkup(
      <AppShell {...makeAppShellViewModel(makeEs(), Universes.Ghibli)}>
        <p>niño</p>
      </AppShell>,
    );

    expect(html).toContain("Dossier de personaje");
    expect(html).toContain('href="/es-MX/ghibli"');
    expect(html).toContain('href="/ghibli"');
    expect(html).toContain("<p>niño</p>");
  });
});
