import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import {
  ghibliSplashImage,
  starWarsSplashImage,
} from "../components/HomeView";
import type { Universe } from "../domain/FilmUniverse.model";
import { I18n, makeEn } from "../i18n/I18n.service";
import { tag as pathParamsTag } from "../platform/ParsedPathParams";
import { loadHome } from "./Home.controller";

const run = (universe: Universe) =>
  loadHome.pipe(
    Effect.provideService(I18n, makeEn()),
    Effect.provideService(pathParamsTag, { universe }),
  );

describe("loadHome", () => {
  it.effect("builds the Star Wars splash", () =>
    Effect.gen(function*() {
      const model = yield* run("star-wars");

      expect(model).toMatchObject({
        _tag: "HomeViewModel",
        shell: { theme: "night" },
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
      const model = yield* run("ghibli");

      expect(model).toMatchObject({
        _tag: "HomeViewModel",
        shell: { theme: "autumn" },
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
