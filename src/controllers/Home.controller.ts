import { Effect } from "effect";
import { makeHomeViewModel } from "../components/HomeView";
import { I18n } from "../i18n/I18n.service";
import { currentUniverse } from "../platform/ParsedPathParams";

export const loadHome = Effect.gen(function*() {
  const i18n = yield* I18n;
  const universe = yield* currentUniverse;
  return makeHomeViewModel(i18n, universe);
});
