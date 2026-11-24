import { Layer, ManagedRuntime } from "effect";
import { FetchHttpClient } from "effect/http";
import { StarWarsClient } from "../services/StarWarsClient";

const AppLayer = StarWarsClient.layer.pipe(
  Layer.provide(FetchHttpClient.layer),
);

export const runtime = ManagedRuntime.make(AppLayer);
