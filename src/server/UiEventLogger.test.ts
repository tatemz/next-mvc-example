import { it } from "@effect/vitest";
import { Effect, Layer, Logger } from "effect";
import { describe, expect } from "vitest";
import {
  UiEventLogger,
  consoleLayer,
  makeUiEventLoggerLayer,
  noopLayer,
} from "./UiEventLogger";

const payload = { event: "page_loaded" };

const captureLogs = () => {
  const messages: Array<unknown> = [];
  const logger = Logger.make(({ message }) => messages.push(message));
  return { layer: Logger.layer([logger]), messages };
};

const logWith = (layer: Layer.Layer<UiEventLogger>) =>
  Effect.flatMap(UiEventLogger, (logger) => logger.log(payload)).pipe(
    Effect.provide(layer),
  );

describe("UiEventLogger", () => {
  it("logs through the console layer", async () => {
    const logs = captureLogs();

    await Effect.runPromise(
      logWith(consoleLayer).pipe(Effect.provide(logs.layer)),
    );

    expect(logs.messages).toEqual([["ui event"]]);
  });

  it("drops messages through the noop layer", async () => {
    const logs = captureLogs();

    await Effect.runPromise(
      logWith(noopLayer).pipe(Effect.provide(logs.layer)),
    );

    expect(logs.messages).toEqual([]);
  });

  it("selects the noop layer for noop mode", () => {
    expect(makeUiEventLoggerLayer("noop")).toBe(noopLayer);
  });

  it("selects the console layer by default", () => {
    expect(makeUiEventLoggerLayer(undefined)).toBe(consoleLayer);
    expect(makeUiEventLoggerLayer("console")).toBe(consoleLayer);
  });
});
