import { it } from "@effect/vitest";
import { Effect, Logger } from "effect";
import { afterEach, describe, expect, vi } from "vitest";
import { logUiEvent, POST } from "./route";

const payload = {
  event: "page_loaded",
  page: "home",
  universe: "star-wars",
  occurredAt: "2026-11-24T12:00:00.000Z",
  properties: {},
};

const requestFor = (body: string) =>
  new Request("http://localhost/api/ui-events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });

afterEach(() => vi.restoreAllMocks());

describe("logUiEvent", () => {
  it("logs the payload through the Effect logger", async () => {
    const records: Array<{
      message: string;
      annotations: Readonly<Record<string, unknown>>;
    }> = [];
    const logger = Logger.make((options) => {
      const structured = Logger.formatStructured.log(options);
      records.push({
        message: Array.isArray(structured.message)
          ? structured.message.map(String).join(" ")
          : String(structured.message),
        annotations: structured.annotations,
      });
    });

    await Effect.runPromise(
      logUiEvent(payload).pipe(
        Effect.provide(Logger.layer([logger])),
      ),
    );

    expect(records).toEqual([
      {
        message: "ui event",
        annotations: { uiEvent: payload },
      },
    ]);
  });
});

describe("POST /api/ui-events", () => {
  it("logs the payload and returns no content", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    const response = await POST(requestFor(JSON.stringify(payload)));

    expect(response.status).toBe(204);
    expect(log).toHaveBeenCalledTimes(1);
  });

  it("rejects a body that is not JSON", async () => {
    const response = await POST(requestFor("{"));

    expect(response.status).toBe(400);
  });
});
