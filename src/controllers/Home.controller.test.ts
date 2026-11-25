import { ExperienceThemes } from "../components/AppShell";
import { Universes, type Universe } from "../domain/FilmUniverse.model";
import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import {
  ghibliSplashImage,
  starWarsSplashImage,
} from "../components/HomeHero";
import { makeEn } from "../i18n/I18n.service";
import { unusedCatalog } from "../services/PeopleCatalog.fixture";
import { loadHome } from "./Home.controller";

const run = (universe: Universe) =>
  Effect.succeed(
    loadHome({ universe, i18n: makeEn(), catalog: unusedCatalog }),
  );

describe("loadHome", () => {
  it.effect("builds the Star Wars splash", () =>
    Effect.gen(function*() {
      const model = yield* run(Universes.StarWars);

      expect(model).toMatchObject({
        _tag: "HomeViewModel",
        shell: { theme: ExperienceThemes.Night },
        hero: {
          kicker: "Star Wars",
          title: "Star Wars character dossier",
          funnelHref: "/star-wars/funnel",
          image: starWarsSplashImage,
        },
      });
    }),
  );

  it.effect("builds the Ghibli splash", () =>
    Effect.gen(function*() {
      const model = yield* run(Universes.Ghibli);

      expect(model).toMatchObject({
        _tag: "HomeViewModel",
        shell: { theme: ExperienceThemes.Autumn },
        hero: {
          kicker: "Ghibli",
          title: "Studio Ghibli character dossier",
          funnelHref: "/ghibli/funnel",
          image: ghibliSplashImage,
        },
      });
    }),
  );
});
