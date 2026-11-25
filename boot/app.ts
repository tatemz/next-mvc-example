import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/http";
import { layer as UiEventApiLayer } from "../src/api/UiEventApi.layer";
import { layer as I18nLayer } from "../src/i18n/I18n.service";
import {
  GhibliCatalog,
  PeopleCatalog,
  StarWarsCatalog,
} from "../src/services/PeopleCatalog";
import { nextCatchAll } from "../src/server/Next";

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

export const app = HttpRouter.serve(
  Layer.mergeAll(
    UiEventApiLayer,
    universeRoutes("/star-wars", starWarsCatalog),
    universeRoutes("/ghibli", ghibliCatalog),
    nextCatchAll("*"),
  ),
  { disableLogger: true, disableListenLog: true },
);
