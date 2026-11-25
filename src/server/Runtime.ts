import { Function, Layer, ManagedRuntime } from "effect";
import { FetchHttpClient } from "effect/http";
import { layer as I18nLayer } from "../i18n/I18n.service";
import * as GhibliPeopleCatalogLayer from "../services/GhibliPeopleCatalog.layer";
import * as SwapiPeopleCatalogLayer from "../services/SwapiPeopleCatalog.layer";

const SwapiAppLayer = Layer.mergeAll(
  I18nLayer,
  Function.pipe(
    SwapiPeopleCatalogLayer.layer,
    Layer.provide(FetchHttpClient.layer),
  ),
);

const GhibliAppLayer = Layer.mergeAll(
  I18nLayer,
  Function.pipe(
    GhibliPeopleCatalogLayer.layer,
    Layer.provide(FetchHttpClient.layer),
  ),
);

export const swapiRuntime = ManagedRuntime.make(SwapiAppLayer);
export const ghibliRuntime = ManagedRuntime.make(GhibliAppLayer);
