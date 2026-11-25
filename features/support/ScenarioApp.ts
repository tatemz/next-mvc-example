import { NodeHttpServer } from "@effect/platform-node";
import { Context, Effect, Layer, Ref } from "effect";
import { resolve } from "node:path";
import { app } from "../../boot/app";
import { nextLayer } from "../../boot/next";
import { serve } from "../../boot/serve";
import {
  haku,
  luke,
  muska,
} from "../../src/domain/FilmUniverse.fixture";
import type { Person } from "../../src/domain/FilmUniverse.model";
import {
  GhibliCatalog,
  PeopleCatalog,
  StarWarsCatalog,
} from "../../src/services/PeopleCatalog";
import {
  catalogOf,
  unavailableCatalog,
} from "../../src/services/PeopleCatalog.fixture";
import {
  UiEventLogger,
  noopUiEventLogger,
} from "../../src/server/UiEventLogger";

export class ScenarioApp extends Context.Service<
  ScenarioApp,
  { readonly url: string }
>()("next-mvc-example/test/ScenarioApp") {}

export type CatalogMode = "working" | "unavailable";

export class CatalogControl extends Context.Service<
  CatalogControl,
  { readonly set: (mode: CatalogMode) => Effect.Effect<void> }
>()("next-mvc-example/test/CatalogControl") {}

const repoRoot = resolve(import.meta.dirname, "../..");

const starWarsPeople: ReadonlyArray<Person> = [luke];
const ghibliPeople: ReadonlyArray<Person> = [haku, muska];

const catalog = (
  people: ReadonlyArray<Person>,
  mode: Ref.Ref<CatalogMode>,
): PeopleCatalog => {
  const working = catalogOf(people);

  return {
    getPerson: (id) =>
      Effect.flatMap(Ref.get(mode), (current) =>
        current === "unavailable"
          ? unavailableCatalog.getPerson(id)
          : working.getPerson(id)
      ),
    searchPeople: (query) =>
      Effect.flatMap(Ref.get(mode), (current) =>
        current === "unavailable"
          ? unavailableCatalog.searchPeople(query)
          : working.searchPeople(query)
      ),
  };
};

const appWithStubs = (mode: Ref.Ref<CatalogMode>) =>
  app.pipe(
    Layer.provide(
      Layer.mergeAll(
        nextLayer(repoRoot),
        NodeHttpServer.layerHttpServices,
        Layer.succeed(StarWarsCatalog, catalog(starWarsPeople, mode)),
        Layer.succeed(GhibliCatalog, catalog(ghibliPeople, mode)),
        Layer.succeed(UiEventLogger, noopUiEventLogger),
      ),
    ),
  );

export const scenarioApp = Layer.unwrap(
  Effect.gen(function*() {
    const mode = yield* Ref.make<CatalogMode>("working");
    const app = Layer.effect(
      ScenarioApp,
      Effect.gen(function*() {
        const url = yield* serve(0)(appWithStubs(mode));
        return ScenarioApp.of({ url });
      }),
    );
    return Layer.merge(
      app,
      Layer.succeed(CatalogControl, {
        set: (next) => Ref.set(mode, next),
      }),
    );
  }),
);
