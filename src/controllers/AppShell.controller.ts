import { Effect } from "effect";
import type { Universe } from "../domain/FilmUniverse.model";
import { makeAppShellViewModel } from "../components/AppShell";
import { I18n } from "../i18n/I18n.service";

export const loadAppShell = (universe: Universe) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    return makeAppShellViewModel(i18n, universe);
  });
