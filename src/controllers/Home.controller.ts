import { Effect } from "effect";
import { makeHomePageViewModel } from "../components/HomeView";
import { I18n } from "../i18n/I18n.service";
import { currentUniverse } from "./Universe.controller";

export const loadHome = Effect.gen(function*() {
  const i18n = yield* I18n;
  const universe = yield* currentUniverse;
  return makeHomePageViewModel(i18n, universe);
});
