import { ExperienceThemes } from "../components/AppShell";
import { Universes } from "../domain/FilmUniverse.model";
import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import {
  ghibliSplashImage,
  starWarsSplashImage,
} from "../components/HomeHero";
import { I18n, makeEn } from "../i18n/I18n.service";
import { tag as pathParamsTag } from "../platform/ParsedPathParams";
import { loadHome } from "./Home.controller";

const run = (universe: string) =>
  loadHome.pipe(
    Effect.provideService(I18n, makeEn()),
    Effect.provideService(pathParamsTag, { universe }),
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

  it.effect("returns not found for an unknown universe", () =>
    Effect.gen(function*() {
      const model = yield* run("unknown");

      expect(model).toMatchObject({ _tag: "NotFoundViewModel" });
    }));

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
