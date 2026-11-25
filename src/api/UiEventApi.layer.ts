import { Effect, Layer } from "effect";
import { HttpApiBuilder } from "effect/http-api";
import { UiEventApi } from "./UiEventApi";

export const layer = HttpApiBuilder.layer(UiEventApi).pipe(
  Layer.provide(
    HttpApiBuilder.group(UiEventApi, "UiEvents", (handlers) =>
      handlers.handle("Ingest", ({ payload }) =>
        Effect.logInfo("ui event").pipe(
          Effect.annotateLogs({ uiEvent: payload }),
        ),
      ),
    ),
  ),
);
