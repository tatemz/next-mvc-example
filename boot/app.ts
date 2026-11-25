import { NodeHttpServer } from "@effect/platform-node";
import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/http";
import { layer as UiEventApiLayer } from "../src/api/UiEventApi.layer";
import { layer as I18nLayer } from "../src/i18n/I18n.service";
import {
  GhibliCatalog,
  PeopleCatalog,
  StarWarsCatalog,
} from "../src/services/PeopleCatalog";
import { nextCatchAll, type Next } from "../src/server/Next";
import type { UiEventLogger } from "../src/server/UiEventLogger";

const starWarsCatalog: Layer.Layer<
  PeopleCatalog,
  never,
  StarWarsCatalog
> = Layer.effect(
  PeopleCatalog,
  Effect.map(StarWarsCatalog, (catalog) => catalog),
);

const ghibliCatalog: Layer.Layer<
  PeopleCatalog,
  never,
  GhibliCatalog
> = Layer.effect(
  PeopleCatalog,
  Effect.map(GhibliCatalog, (catalog) => catalog),
);

const universeRoutes = (
  path: `/${string}`,
  catalog: Layer.Layer<PeopleCatalog, never, StarWarsCatalog | GhibliCatalog>,
) =>
  HttpRouter.provideRequest(
    Layer.mergeAll(I18nLayer, catalog),
  )(
    Layer.mergeAll(nextCatchAll(path), nextCatchAll(`${path}/*`)),
  );

const app = HttpRouter.serve(
  Layer.mergeAll(
    UiEventApiLayer,
    universeRoutes("/star-wars", starWarsCatalog),
    universeRoutes("/ghibli", ghibliCatalog),
    nextCatchAll("*"),
  ),
  { disableLogger: true, disableListenLog: true },
);

export type AppServices =
  | Next
  | StarWarsCatalog
  | GhibliCatalog
  | UiEventLogger;

export const appWith = <E>(services: Layer.Layer<AppServices, E>) =>
  app.pipe(
    Layer.provide(
      Layer.mergeAll(services, NodeHttpServer.layerHttpServices),
    ),
  );
