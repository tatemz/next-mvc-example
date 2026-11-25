import { Effect } from "effect";
import type { ExperienceTheme } from "../components/AppShell";
import {
  makeHomeViewModel,
  type HomeHeroImageViewModel,
} from "../components/HomeView";
import { I18n } from "../i18n/I18n.service";
import type { Universe } from "../domain/FilmUniverse.model";
import { loadAppShell } from "./AppShell.controller";

export const loadHome = (
  universe: Universe,
  funnelHref: string,
  theme: ExperienceTheme,
  image: HomeHeroImageViewModel,
) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const shell = yield* loadAppShell(theme);
    return makeHomeViewModel(i18n, universe, funnelHref, shell, image);
  });
