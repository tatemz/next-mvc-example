import { Function, Layer, ManagedRuntime } from "effect";
import { FetchHttpClient } from "effect/http";
import { layer as I18nLayer } from "../i18n/I18n.service";
import * as StarWarsClientLayer from "../services/StarWarsClient.layer";

const AppLayer = Layer.mergeAll(
  I18nLayer,
  Function.pipe(
    StarWarsClientLayer.layer,
    Layer.provide(FetchHttpClient.layer),
  ),
);

export const runtime = ManagedRuntime.make(AppLayer);
