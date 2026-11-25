import { Effect, Layer } from "effect";
import { FetchHttpClient } from "effect/http";
import { layer as GhibliCatalogLayer } from "../src/services/GhibliPeopleCatalog.layer";
import {
  GhibliCatalog,
  PeopleCatalog,
  StarWarsCatalog,
} from "../src/services/PeopleCatalog";
import { layer as SwapiCatalogLayer } from "../src/services/SwapiPeopleCatalog.layer";
import {
  UiEventLogger,
  makeUiEventLogger,
} from "../src/server/UiEventLogger";
import { appWith } from "./app";
import { nextLayer } from "./next";

const catalogs = Layer.mergeAll(
  Layer.effect(
    StarWarsCatalog,
    Effect.map(PeopleCatalog, (catalog) => catalog),
  ).pipe(Layer.provide(SwapiCatalogLayer)),
  Layer.effect(
    GhibliCatalog,
    Effect.map(PeopleCatalog, (catalog) => catalog),
  ).pipe(Layer.provide(GhibliCatalogLayer)),
).pipe(Layer.provide(FetchHttpClient.layer));

export const liveApp = (dir: string) =>
  appWith(
    Layer.mergeAll(
      nextLayer(dir),
      catalogs,
      Layer.succeed(
        UiEventLogger,
        makeUiEventLogger(process.env.UI_EVENT_LOGGER),
      ),
    ),
  );
