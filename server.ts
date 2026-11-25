import {
  NodeHttpServer,
  NodeHttpServerRequest,
  NodeRuntime,
} from "@effect/platform-node";
import { Config, Console, Effect, Layer, Schema } from "effect";
import * as HttpRouter from "effect/http/HttpRouter";
import * as HttpServer from "effect/http/HttpServer";
import * as HttpServerRequest from "effect/http/HttpServerRequest";
import * as HttpServerResponse from "effect/http/HttpServerResponse";
import NextPackage from "next";
import { createServer } from "node:http";
import { layer as UiEventApiLayer } from "./src/api/UiEventApi.layer";
import { layer as UiEventLoggerLayer } from "./src/server/UiEventLogger";

class NextRenderError extends Schema.TaggedError<
  NextRenderError,
  { readonly brand: unique symbol }
>()("NextRenderError", { cause: Schema.Defect() }) {}

const nextRoute = (
  handleNext: ReturnType<
    ReturnType<typeof NextPackage>["getRequestHandler"]
  >,
) =>
  HttpRouter.add(
    "*",
    "*",
    (request: HttpServerRequest.HttpServerRequest) =>
      Effect.gen(function*() {
      const incoming =
        NodeHttpServerRequest.toIncomingMessage(request);
      if ("stream" in incoming) {
        return yield* Effect.die(
          "Next requires HTTP/1.1, but this request is HTTP/2",
        );
      }

      const response =
        NodeHttpServerRequest.toServerResponse(request);
      if ("stream" in response) {
        return yield* Effect.die(
          "Next requires HTTP/1.1, but this response is HTTP/2",
        );
      }

      yield* Effect.tryPromise({
        try: () =>
          new Promise<void>((resolve, reject) => {
            response.once("finish", resolve);
            response.once("close", resolve);
            response.once("error", reject);
            void handleNext(incoming, response);
          }),
        catch: (cause) => new NextRenderError({ cause }),
      });

      return HttpServerResponse.empty({
        status: response.statusCode,
      });
    }),
  );

const start = Effect.gen(function*() {
  const port = yield* Config.Int("PORT").pipe(
    Config.withDefault(3000),
  );
  const nextApp = NextPackage({
    dev: false,
    dir: process.cwd(),
    quiet: true,
  });
  yield* Effect.addFinalizer(() =>
    Effect.tryPromise(() => nextApp.close()).pipe(Effect.ignore),
  );
  yield* Effect.tryPromise(() => nextApp.prepare());
  const handleNext = nextApp.getRequestHandler();

  const served = HttpRouter.serve(
    Layer.mergeAll(UiEventApiLayer, nextRoute(handleNext)),
    { disableLogger: true, disableListenLog: true },
  );
  const infrastructure = Layer.mergeAll(
    NodeHttpServer.layer(() => createServer(), {
      host: "127.0.0.1",
      port,
    }),
    UiEventLoggerLayer,
  );
  const context = yield* Layer.build(
    Layer.provideMerge(served, infrastructure),
  );
  const baseUrl = yield* HttpServer.addressFormattedWith(
    Effect.succeed,
  ).pipe(Effect.provideContext(context));
  yield* Console.log(`Local: ${baseUrl}`);
  return yield* Effect.never;
});

NodeRuntime.runMain(Effect.scoped(start));
