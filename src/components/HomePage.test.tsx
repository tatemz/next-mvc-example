import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { ghibli, homeSplash, starWars } from "../../.storybook/pageFixtures";
import { HomePage } from "./HomePage";

const render = (dataset: typeof starWars) =>
  renderToStaticMarkup(
    <HomePage {...homeSplash(dataset)} onCtaClick={() => {}} />,
  );

describe("HomePage", () => {
  it("renders the Star Wars splash and funnel CTA", () => {
    const html = render(starWars);

    expect(html).toContain("Star Wars character dossier");
    expect(html).toContain("Build a dossier");
    expect(html).toContain('href="/star-wars/funnel"');
    expect(html).toContain('data-theme="night"');
    expect(html).toContain("Pillars of Creation");
    expect(html).toContain("NASA, ESA, and the Hubble Heritage Team");
  });

  it("renders the Ghibli splash and funnel CTA", () => {
    const html = render(ghibli);

    expect(html).toContain("Studio Ghibli character dossier");
    expect(html).toContain("Build a dossier");
    expect(html).toContain('href="/ghibli/funnel"');
    expect(html).toContain('data-theme="autumn"');
    expect(html).toContain("Spirited Away film poster");
    expect(html).toContain("Studio Ghibli, via TMDB");
  });
});
