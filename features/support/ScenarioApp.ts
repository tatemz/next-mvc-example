import { Context, Effect, Layer, Ref } from "effect";
import { resolve } from "node:path";
import { appWith } from "../../boot/app";
import { nextLayer } from "../../boot/next";
import { serve } from "../../boot/serve";
import { noopUiEventLogger } from "../../src/server/UiEventLogger";
import {
  CatalogControl,
  type CatalogMode,
  catalogs,
} from "./CatalogStub";

export class ScenarioApp extends Context.Service<
  ScenarioApp,
  { readonly url: string }
>()("next-mvc-example/test/ScenarioApp") {}

const repoRoot = resolve(import.meta.dirname, "../..");

const appWithStubs = (mode: Ref.Ref<CatalogMode>) =>
  appWith({
    next: nextLayer(repoRoot),
    catalogs: catalogs(mode),
    uiEventLogger: noopUiEventLogger,
  });

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
