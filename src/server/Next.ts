import { Context, Effect, Schema } from "effect";
import * as HttpRouter from "effect/http/HttpRouter";
import type * as HttpServerRequest from "effect/http/HttpServerRequest";
import type * as HttpServerResponse from "effect/http/HttpServerResponse";

export class NextError extends Schema.TaggedError<
  NextError,
  { readonly brand: unique symbol }
>()("NextError", {
  stage: Schema.Literals(["prepare", "render"]),
  cause: Schema.Defect(),
}) {}

export class Next extends Context.Service<
  Next,
  {
    readonly render: (
      request: HttpServerRequest.HttpServerRequest,
      context: Context.Context<never>,
    ) => Effect.Effect<HttpServerResponse.HttpServerResponse, NextError>;
  }
>()("next-mvc-example/Next") {}

export const nextCatchAll = (path: HttpRouter.PathInput) =>
  HttpRouter.add(
    "*",
    path,
    (request: HttpServerRequest.HttpServerRequest) =>
      Effect.gen(function*() {
        const next = yield* Next;
        const context = yield* Effect.context<never>();
        return yield* next.render(request, context);
      }),
  );
