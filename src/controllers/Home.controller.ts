import { Effect, Option } from "effect";
import { makeNotFoundViewModel } from "../components/NotFoundView";
import { makeHomeViewModel } from "../components/HomeView";
import { I18n } from "../i18n/I18n.service";
import { currentUniverse } from "./Universe.controller";

export const loadHome = Effect.gen(function*() {
  const i18n = yield* I18n;
  const universe = yield* currentUniverse;

  return Option.match(universe, {
    onNone: () => makeNotFoundViewModel(i18n),
    onSome: (value) => makeHomeViewModel(i18n, value),
  });
});
