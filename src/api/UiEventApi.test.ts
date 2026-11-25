import {
  NodeFileSystem,
  NodeHttpServer,
  NodePath,
} from "@effect/platform-node";
import { Context, Effect, Layer } from "effect";
import { HttpRouter } from "effect/http";
import { describe, expect, it } from "vitest";
import { UiEventLogger } from "../server/UiEventLogger";
import { layer } from "./UiEventApi.layer";

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

const collector = (payloads: Array<unknown>) => ({
  log: (event: unknown) =>
    Effect.sync(() => payloads.push(event)),
});

const handlerFor = (payloads: Array<unknown>) =>
  HttpRouter.toWebHandler(
    layer.pipe(
      Layer.provide(
        Layer.succeed(UiEventLogger, collector(payloads)),
      ),
      Layer.provideMerge(NodeHttpServer.layerHttpServices),
      Layer.provideMerge(NodeFileSystem.layer),
      Layer.provideMerge(NodePath.layer),
    ),
    { disableLogger: true },
  );

describe("UiEventApi", () => {
  it("logs a valid event and returns no content", async () => {
    const payloads: Array<unknown> = [];
    const { handler, dispose } = handlerFor(payloads);

    try {
      const response = await handler(
        requestFor(JSON.stringify(payload)),
        Context.make(UiEventLogger, collector(payloads)),
      );

      expect(response.status).toBe(204);
      expect(payloads).toEqual([payload]);
    } finally {
      await dispose();
    }
  });

  it("rejects an invalid payload", async () => {
    const payloads: Array<unknown> = [];
    const { handler, dispose } = handlerFor(payloads);

    try {
      const response = await handler(
        requestFor("{}"),
        Context.make(UiEventLogger, collector(payloads)),
      );

      expect(response.status).toBe(400);
      expect(payloads).toEqual([]);
    } finally {
      await dispose();
    }
  });
});
