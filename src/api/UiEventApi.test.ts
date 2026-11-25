import { Universes } from "../domain/FilmUniverse.model";
import {
  NodeFileSystem,
  NodeHttpServer,
  NodePath,
} from "@effect/platform-node";
import { Context, Layer, Logger } from "effect";
import { HttpRouter } from "effect/http";
import { describe, expect, it } from "vitest";
import { layer } from "./UiEventApi.layer";

const payload = {
  event: "page_loaded",
  page: "home",
  universe: Universes.StarWars,
  occurredAt: "2026-11-24T12:00:00.000Z",
  properties: {},
};

const requestFor = (body: string) =>
  new Request("http://localhost/api/ui-events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });

const handlerFor = (messages: Array<unknown>) =>
  HttpRouter.toWebHandler(
    layer.pipe(
      Layer.provide(
        Logger.layer([
          Logger.make(({ message }) => messages.push(message)),
        ]),
      ),
      Layer.provideMerge(NodeHttpServer.layerHttpServices),
      Layer.provideMerge(NodeFileSystem.layer),
      Layer.provideMerge(NodePath.layer),
    ),
    { disableLogger: true },
  );

describe("UiEventApi", () => {
  it("logs a valid event and returns no content", async () => {
    const messages: Array<unknown> = [];
    const { handler, dispose } = handlerFor(messages);

    try {
      const response = await handler(
        requestFor(JSON.stringify(payload)),
        Context.empty(),
      );

      expect(response.status).toBe(204);
      expect(messages).toEqual([["ui event"]]);
    } finally {
      await dispose();
    }
  });

  it("rejects an invalid payload", async () => {
    const messages: Array<unknown> = [];
    const { handler, dispose } = handlerFor(messages);

    try {
      const response = await handler(requestFor("{}"), Context.empty());

      expect(response.status).toBe(400);
      expect(messages).toEqual([]);
    } finally {
      await dispose();
    }
  });
});
