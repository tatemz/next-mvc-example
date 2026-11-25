import { Universes } from "../domain/FilmUniverse.model";
import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { luke } from "../domain/FilmUniverse.fixture";
import { makeEn } from "../i18n/I18n.service";
import { makeAppShellViewModel } from "./AppShell";
import {
  ResultsView,
  makeResultsMissingViewModel,
  makeResultsReadyViewModel,
} from "./ResultsView";

const i18n = makeEn();
const shell = makeAppShellViewModel(i18n, Universes.StarWars);
const person = luke;
const film = luke.films[0];
const transport = luke.transports[0];

describe("ResultsView", () => {
  it("renders a complete dossier", () => {
    const model = makeResultsReadyViewModel(
      i18n,
      shell,
      person,
      film,
      transport,
      Universes.StarWars,
    );
    const html = renderToStaticMarkup(<ResultsView model={model} onCtaClick={() => {}} />);

    expect(html).toContain("Your dossier");
    expect(html).toContain("Luke Skywalker");
    expect(html).toContain("A New Hope");
    expect(html).toContain("X-wing (Starship)");
    expect(html).toContain("Build another dossier");
    expect(html).toContain("Back home");
  });

  it("renders a film poster when the film has one", () => {
    const illustratedFilm = {
      ...film,
      imageUrl: "https://example.com/poster.jpg",
    };
    const html = renderToStaticMarkup(
      <ResultsView
        model={makeResultsReadyViewModel(
          i18n,
          shell,
          person,
          illustratedFilm,
          transport,
          Universes.StarWars,
        )}
        onCtaClick={() => {}}
      />,
    );

    expect(html).toContain("poster.jpg");
  });

  it("renders a dossier without a transport", () => {
    const model = makeResultsReadyViewModel(
      i18n,
      shell,
      person,
      film,
      null,
      Universes.StarWars,
    );
    const html = renderToStaticMarkup(<ResultsView model={model} onCtaClick={() => {}} />);

    expect(html).toContain("No transport selected");
  });

  it("renders a missing dossier", () => {
    const model = makeResultsMissingViewModel(i18n, Universes.StarWars);
    const html = renderToStaticMarkup(<ResultsView model={model} onCtaClick={() => {}} />);

    expect(html).toContain("Dossier not found");
    expect(html).toContain('role="alert"');
    expect(html).toContain("Build a dossier");
  });
});
