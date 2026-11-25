import { Context, Effect, Layer } from "effect";

export class UiEventLogger extends Context.Service<
  UiEventLogger,
  {
    readonly log: (payload: unknown) => Effect.Effect<void>;
  }
>()("next-mvc-example/UiEventLogger") {}

export const consoleLayer = Layer.succeed(UiEventLogger, {
  log: (payload) =>
    Effect.logInfo("ui event").pipe(
      Effect.annotateLogs({ uiEvent: payload }),
    ),
});

export const noopLayer = Layer.succeed(UiEventLogger, {
  log: () => Effect.void,
});

export const makeUiEventLoggerLayer = (mode: string | undefined) =>
  mode === "noop" ? noopLayer : consoleLayer;

export const layer = makeUiEventLoggerLayer(
  process.env.UI_EVENT_LOGGER,
);
