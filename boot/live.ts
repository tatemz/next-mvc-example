import { Context, Effect, Layer } from "effect";
import type { Universe } from "../src/domain/FilmUniverse.model";
import { layer as GhibliCatalogLayer } from "../src/services/GhibliPeopleCatalog.layer";
import { PeopleCatalog } from "../src/services/PeopleCatalog";
import { layer as SwapiCatalogLayer } from "../src/services/SwapiPeopleCatalog.layer";
import {
  UiEventLogger,
  makeUiEventLogger,
} from "../src/server/UiEventLogger";
import { appWith } from "./app";
import { nextLayer } from "./next";

const catalogValue = <E, R>(layer: Layer.Layer<PeopleCatalog, E, R>) =>
  Layer.build(layer).pipe(
    Effect.map((context) => Context.get(context, PeopleCatalog)),
  );

export const liveCatalogs = Effect.gen(function*() {
  return {
    "star-wars": yield* catalogValue(SwapiCatalogLayer),
    ghibli: yield* catalogValue(GhibliCatalogLayer),
  };
});

export const liveApp = (
  dir: string,
  catalogs: Record<Universe, PeopleCatalog>,
) =>
  appWith({
    next: nextLayer(dir),
    catalogs,
    uiEventLogger: makeUiEventLogger(process.env.UI_EVENT_LOGGER),
  });
