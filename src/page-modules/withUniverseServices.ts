import { Effect, Option } from "effect";
import {
  makeNotFoundViewModel,
  type NotFoundViewModel,
} from "../components/NotFoundView";
import {
  decodeLocale,
  decodeUniverse,
} from "../controllers/Universe.controller";
import type { Universe } from "../domain/FilmUniverse.model";
import { type I18n, I18nCatalog } from "../i18n/I18n.service";
import {
  tag as pathParamsTag,
  type ParsedPathParams,
} from "../platform/ParsedPathParams";
import type { ParsedSearchParams } from "../platform/ParsedSearchParams";
import { Catalogs } from "../services/Catalogs";
import type { PeopleCatalog } from "../services/PeopleCatalog";

export type UniverseServices = {
  readonly universe: Universe;
  readonly catalog: PeopleCatalog;
  readonly i18n: I18n;
};

export const withUniverseServices = <A, E>(
  build: (
    services: UniverseServices,
  ) => Effect.Effect<A, E, ParsedSearchParams>,
): Effect.Effect<
  A | NotFoundViewModel,
  E,
  Catalogs | I18nCatalog | ParsedPathParams | ParsedSearchParams
> =>
  Effect.gen(function*() {
    const params = yield* pathParamsTag;
    const locale = decodeLocale(params);
    const i18n = (yield* I18nCatalog)[locale];
    const universe = decodeUniverse(params);

    if (Option.isNone(universe)) {
      return makeNotFoundViewModel(i18n);
    }

    const catalogs = yield* Catalogs;
    return yield* build({
      universe: universe.value,
      catalog: catalogs[universe.value],
      i18n,
    });
  });
