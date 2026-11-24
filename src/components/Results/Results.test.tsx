import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { luke } from "../../domain/StarWars.fixture";
import { makeEn } from "../../i18n/I18n.service";
import { makePersonViewModel } from "../PersonCard/PersonCard";
import {
  Results,
  makeResultsMissingViewModel,
  makeResultsReadyViewModel,
} from "./Results";

const i18n = makeEn();
const person = makePersonViewModel(i18n, luke);
const film = person.films[0];
const transport = person.transports[0];

describe("Results", () => {
  it("renders a complete dossier", () => {
    const model = makeResultsReadyViewModel(
      i18n,
      person,
      film,
      transport,
    );
    const html = renderToStaticMarkup(<Results {...model} />);

    expect(html).toContain("Character dossier");
    expect(html).toContain("Luke Skywalker");
    expect(html).toContain("A New Hope (Episode 4)");
    expect(html).toContain("X-wing (Starship)");
    expect(html).toContain("Build another dossier");
    expect(html).toContain("Back home");
  });

  it("renders a dossier without a transport", () => {
    const model = makeResultsReadyViewModel(i18n, person, film, null);
    const html = renderToStaticMarkup(<Results {...model} />);

    expect(html).toContain("No transport selected");
  });

  it("renders a missing dossier", () => {
    const model = makeResultsMissingViewModel(i18n);
    const html = renderToStaticMarkup(<Results {...model} />);

    expect(html).toContain("Dossier not found");
    expect(html).toContain('role="alert"');
    expect(html).toContain("Build a dossier");
  });
});
