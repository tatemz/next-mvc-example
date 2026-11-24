import { Layer, ManagedRuntime } from "effect";
import { FetchHttpClient } from "effect/http";
import * as StarWarsClientLayer from "../services/StarWarsClient.layer";

const AppLayer = StarWarsClientLayer.layer.pipe(
  Layer.provide(FetchHttpClient.layer),
);

export const runtime = ManagedRuntime.make(AppLayer);
