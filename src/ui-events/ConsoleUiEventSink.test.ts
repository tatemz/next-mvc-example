import { Universes } from "../domain/FilmUniverse.model";
import { afterEach, describe, expect, it, vi } from "vitest";
import { consoleUiEventSink } from "./ConsoleUiEventSink";
import type { UiEventPayload } from "./UiEventPayload";

const payload: UiEventPayload = {
  event: "page_loaded",
  page: "home",
  universe: Universes.StarWars,
  occurredAt: "2026-11-24T12:00:00.000Z",
  properties: {},
};

afterEach(() => vi.restoreAllMocks());

describe("consoleUiEventSink", () => {
  it("logs the payload to the console", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});

    consoleUiEventSink(payload);

    expect(info).toHaveBeenCalledWith("ui event", payload);
  });
});
