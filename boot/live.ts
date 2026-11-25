import { Context, Effect, Layer } from "effect";
import {
  Universes,
  type Universe,
} from "../src/domain/FilmUniverse.model";
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
  const catalogs: Record<Universe, PeopleCatalog> = {
    [Universes.StarWars]: yield* catalogValue(SwapiCatalogLayer),
    [Universes.Ghibli]: yield* catalogValue(GhibliCatalogLayer),
  };
  return catalogs;
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
