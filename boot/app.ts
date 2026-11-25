import { NodeHttpServer } from "@effect/platform-node";
import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/http";
import { layer as UiEventApiLayer } from "../src/api/UiEventApi.layer";
import {
  Universes,
  type Universe,
} from "../src/domain/FilmUniverse.model";
import { layer as I18nLayer } from "../src/i18n/I18n.service";
import { PeopleCatalog } from "../src/services/PeopleCatalog";
import { nextCatchAll, type Next } from "../src/server/Next";

const universeRoutes = (path: `/${string}`, catalog: PeopleCatalog) =>
  HttpRouter.provideRequest(
    Layer.mergeAll(I18nLayer, Layer.succeed(PeopleCatalog, catalog)),
  )(
    Layer.mergeAll(nextCatchAll(path), nextCatchAll(`${path}/*`)),
  );

export type AppServices<E = never> = {
  readonly next: Layer.Layer<Next, E>;
  readonly catalogs: Record<Universe, PeopleCatalog>;
};

export const appWith = <E>(services: AppServices<E>) =>
  HttpRouter.serve(
    Layer.mergeAll(
      UiEventApiLayer,
      universeRoutes(
        `/${Universes.StarWars}`,
        services.catalogs[Universes.StarWars],
      ),
      universeRoutes(
        `/${Universes.Ghibli}`,
        services.catalogs[Universes.Ghibli],
      ),
      nextCatchAll("*"),
    ),
    { disableLogger: true, disableListenLog: true },
  ).pipe(
    Layer.provide(
      Layer.mergeAll(
        services.next,
        NodeHttpServer.layerHttpServices,
      ),
    ),
  );
