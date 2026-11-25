import { NodeHttpServer } from "@effect/platform-node";
import { Layer } from "effect";
import { HttpRouter } from "effect/http";
import { layer as UiEventApiLayer } from "../src/api/UiEventApi.layer";
import type { Universe } from "../src/domain/FilmUniverse.model";
import { layer as I18nCatalogLayer } from "../src/i18n/I18n.service";
import { Catalogs } from "../src/services/Catalogs";
import type { PeopleCatalog } from "../src/services/PeopleCatalog";
import { nextCatchAll, type Next } from "../src/server/Next";

const app = HttpRouter.serve(
  Layer.mergeAll(UiEventApiLayer, nextCatchAll("*")),
  { disableLogger: true, disableListenLog: true },
);

export type AppServices<E = never> = {
  readonly next: Layer.Layer<Next, E>;
  readonly catalogs: Record<Universe, PeopleCatalog>;
};

export const appWith = <E>(services: AppServices<E>) =>
  app.pipe(
    Layer.provide(
      Layer.mergeAll(
        services.next,
        Layer.succeed(Catalogs, services.catalogs),
        I18nCatalogLayer,
        NodeHttpServer.layerHttpServices,
      ),
    ),
  );
