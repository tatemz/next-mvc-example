import { NodeHttpServerRequest } from "@effect/platform-node";
import { Effect, Layer } from "effect";
import * as HttpServerResponse from "effect/http/HttpServerResponse";
import NextPackage from "next";
import { Next, NextError } from "../src/server/Next";
import { runInRenderContext } from "../src/server/RenderContext";

export const nextLayer = (dir: string) =>
  Layer.effect(
    Next,
    Effect.gen(function*() {
      const next = NextPackage({ dev: false, dir, quiet: true });
      yield* Effect.addFinalizer(() =>
        Effect.tryPromise(() => next.close()).pipe(Effect.ignore),
      );
      yield* Effect.tryPromise({
        try: () => next.prepare(),
        catch: (cause) => new NextError({ stage: "prepare", cause }),
      });
      const handle = next.getRequestHandler();

      return Next.of({
        render: (request, context) =>
          Effect.gen(function*() {
            const incoming = NodeHttpServerRequest.toIncomingMessage(
              request,
            );
            if ("stream" in incoming) {
              return yield* Effect.die(
                "Next requires HTTP/1.1, but this request is HTTP/2",
              );
            }

            const response = NodeHttpServerRequest.toServerResponse(
              request,
            );
            if ("stream" in response) {
              return yield* Effect.die(
                "Next requires HTTP/1.1, but this response is HTTP/2",
              );
            }

            yield* Effect.tryPromise({
              try: () =>
                runInRenderContext(
                  context,
                  () =>
                    new Promise<void>((resolve, reject) => {
                      response.once("finish", resolve);
                      response.once("close", resolve);
                      response.once("error", reject);
                      void handle(incoming, response);
                    }),
                ),
              catch: (cause) => new NextError({ stage: "render", cause }),
            });

            return HttpServerResponse.empty({
              status: response.statusCode,
            });
          }),
      });
    }),
  );
