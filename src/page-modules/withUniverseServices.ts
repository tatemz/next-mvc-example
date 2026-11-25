import { Effect, Option } from "effect";
import {
  makeNotFoundViewModel,
  type NotFoundViewModel,
} from "../components/NotFoundView";
import { decodeUniverse } from "../controllers/Universe.controller";
import type { Universe } from "../domain/FilmUniverse.model";
import { I18n } from "../i18n/I18n.service";
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
  Catalogs | I18n | ParsedPathParams | ParsedSearchParams
> =>
  Effect.gen(function*() {
    const params = yield* pathParamsTag;
    const catalogs = yield* Catalogs;
    const i18n = yield* I18n;

    return yield* Option.match(decodeUniverse(params), {
      onNone: () => Effect.succeed(makeNotFoundViewModel(i18n)),
      onSome: (universe) =>
        build({
          universe,
          catalog: catalogs[universe],
          i18n,
        }),
    });
  });

export const withUniverseFor =
  (universe: Universe) =>
  <A, E>(
    build: (services: UniverseServices) => Effect.Effect<A, E>,
  ): Effect.Effect<A, E, Catalogs | I18n> =>
    Effect.gen(function*() {
      const catalogs = yield* Catalogs;
      const i18n = yield* I18n;

      return yield* build({
        universe,
        catalog: catalogs[universe],
        i18n,
      });
    });
