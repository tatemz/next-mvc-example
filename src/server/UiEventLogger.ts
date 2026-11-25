import { Context, Effect } from "effect";

export type UiEventLoggerService = {
  readonly log: (payload: unknown) => Effect.Effect<void>;
};

export class UiEventLogger extends Context.Service<
  UiEventLogger,
  UiEventLoggerService
>()("next-mvc-example/UiEventLogger") {}

export const consoleUiEventLogger: UiEventLoggerService = {
  log: (payload) =>
    Effect.logInfo("ui event").pipe(
      Effect.annotateLogs({ uiEvent: payload }),
    ),
};

export const noopUiEventLogger: UiEventLoggerService = {
  log: () => Effect.void,
};

export const makeUiEventLogger = (
  mode: string | undefined,
): UiEventLoggerService =>
  mode === "noop" ? noopUiEventLogger : consoleUiEventLogger;
