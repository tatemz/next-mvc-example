import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import {
  HomeHeroImageViewModel,
} from "../components/HomePage";
import { I18n, makeEn } from "../i18n/I18n.service";
import { loadHomePage } from "./HomePage.controller";

const image = HomeHeroImageViewModel.make({
  url: "https://example.com/splash.jpg",
  alt: "Splash image",
  credit: "Image credit",
  creditHref: "https://example.com/credit",
});

const run = (
  universe: "star-wars" | "ghibli",
  funnelHref: string,
  theme: "night" | "autumn",
) =>
  loadHomePage(universe, funnelHref, theme, image).pipe(
    Effect.provideService(I18n, makeEn()),
  );

describe("loadHomePage", () => {
  it.effect("builds the Star Wars splash", () =>
    Effect.gen(function*() {
      const model = yield* run(
        "star-wars",
        "/star-wars/funnel",
        "night",
      );

      expect(model).toMatchObject({
        _tag: "HomePageViewModel",
        shell: { theme: "night" },
        hero: {
          kicker: "Star Wars",
          title: "Star Wars character dossier",
          funnelHref: "/star-wars/funnel",
          image,
        },
      });
    }),
  );

  it.effect("builds the Ghibli splash", () =>
    Effect.gen(function*() {
      const model = yield* run("ghibli", "/ghibli/funnel", "autumn");

      expect(model).toMatchObject({
        _tag: "HomePageViewModel",
        shell: { theme: "autumn" },
        hero: {
          kicker: "Ghibli",
          title: "Studio Ghibli character dossier",
          funnelHref: "/ghibli/funnel",
          image,
        },
      });
    }),
  );
});
