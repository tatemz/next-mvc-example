import { Effect } from "effect";
import {
  makeAppShellViewModel,
  type ExperienceTheme,
} from "../components/AppShell";
import { I18n } from "../i18n/I18n.service";

export const loadAppShell = (theme: ExperienceTheme) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    return makeAppShellViewModel(i18n, theme);
  });
