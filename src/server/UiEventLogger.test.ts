import { it } from "@effect/vitest";
import { Effect, Logger } from "effect";
import { describe, expect } from "vitest";
import {
  UiEventLogger,
  type UiEventLoggerService,
  consoleUiEventLogger,
  makeUiEventLogger,
  noopUiEventLogger,
} from "./UiEventLogger";

const payload = { event: "page_loaded" };

const captureLogs = () => {
  const messages: Array<unknown> = [];
  const logger = Logger.make(({ message }) => messages.push(message));
  return { layer: Logger.layer([logger]), messages };
};

const logWith = (service: UiEventLoggerService) =>
  Effect.flatMap(UiEventLogger, (logger) => logger.log(payload)).pipe(
    Effect.provideService(UiEventLogger, service),
  );

describe("UiEventLogger", () => {
  it("logs through the console logger", async () => {
    const logs = captureLogs();

    await Effect.runPromise(
      logWith(consoleUiEventLogger).pipe(Effect.provide(logs.layer)),
    );

    expect(logs.messages).toEqual([["ui event"]]);
  });

  it("drops messages through the noop logger", async () => {
    const logs = captureLogs();

    await Effect.runPromise(
      logWith(noopUiEventLogger).pipe(Effect.provide(logs.layer)),
    );

    expect(logs.messages).toEqual([]);
  });

  it("selects the noop logger for noop mode", () => {
    expect(makeUiEventLogger("noop")).toBe(noopUiEventLogger);
  });

  it("selects the console logger by default", () => {
    expect(makeUiEventLogger(undefined)).toBe(consoleUiEventLogger);
    expect(makeUiEventLogger("console")).toBe(consoleUiEventLogger);
  });
});
