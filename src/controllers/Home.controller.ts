import { Effect } from "effect";
import type { Universe } from "../domain/FilmUniverse.model";
import { makeHomeViewModel } from "../components/HomeView";
import { I18n } from "../i18n/I18n.service";
import { loadAppShell } from "./AppShell.controller";

export const loadHome = (universe: Universe) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const shell = yield* loadAppShell(universe);
    return makeHomeViewModel(i18n, universe, shell);
  });
