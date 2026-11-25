import { Effect } from "effect";
import type { ExperienceTheme } from "../components/AppShell";
import {
  makeHomePageViewModel,
  type HomeHeroImageViewModel,
} from "../components/HomePage";
import { I18n } from "../i18n/I18n.service";
import type { Universe } from "../ui-events/UiEvent";
import { loadAppShell } from "./AppShell.controller";

export const loadHomePage = (
  universe: Universe,
  funnelHref: string,
  theme: ExperienceTheme,
  image: HomeHeroImageViewModel,
) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const shell = yield* loadAppShell(theme);
    return makeHomePageViewModel(i18n, universe, funnelHref, shell, image);
  });
