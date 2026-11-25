import { NodeHttpServer } from "@effect/platform-node";
import { Effect, Layer } from "effect";
import * as HttpServer from "effect/http/HttpServer";
import { createServer } from "node:http";

export const serve =
  (port: number) =>
  <E>(app: Layer.Layer<never, E, HttpServer.HttpServer>) =>
    Effect.gen(function*() {
      const context = yield* Layer.build(
        Layer.provideMerge(
          app,
          NodeHttpServer.layer(() => createServer(), {
            host: "127.0.0.1",
            port,
          }),
        ),
      );
      return yield* HttpServer.addressFormattedWith(
        Effect.succeed,
      ).pipe(Effect.provideContext(context));
    });
