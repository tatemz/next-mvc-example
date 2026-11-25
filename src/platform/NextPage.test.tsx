import { it } from "@effect/vitest";
import { Effect, Layer, ManagedRuntime, Option, Schema } from "effect";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string, type?: string) => {
    throw new Error(`NEXT_REDIRECT;${type};${url}`);
  }),
}));

import { redirect } from "next/navigation";
import { makeNextPage } from "./NextPage";
import { NextRedirect } from "./NextRedirect";
import { type ParsedSearchParams, decodeOption } from "./ParsedSearchParams";

const Params = Schema.Struct({
  id: Schema.NumberFromString.check(Schema.isInt()),
});

const runtime = ManagedRuntime.make(Layer.empty);

const Page = makeNextPage(
  runtime,
  Effect.gen(function*() {
    const params = yield* decodeOption(Params);
    return Option.match(params, {
      onNone: () => <p>none</p>,
      onSome: (value) => <p>{value.id}</p>,
    });
  }),
);

const render = (searchParams: ParsedSearchParams) =>
  Effect.promise(() =>
    Page({ searchParams: Promise.resolve(searchParams) }),
  ).pipe(Effect.map(renderToStaticMarkup));

describe("makeNextPage", () => {
  it.effect("decodes a string search param", () =>
    Effect.gen(function*() {
      expect(yield* render({ id: "3" })).toContain("<p>3</p>");
    }),
  );

  it.effect("takes the first value of an array search param", () =>
    Effect.gen(function*() {
      expect(yield* render({ id: ["4", "5"] })).toContain("<p>4</p>");
    }),
  );

  it.effect("passes none when a required param is missing", () =>
    Effect.gen(function*() {
      expect(yield* render({})).toContain("<p>none</p>");
      expect(yield* render({ id: undefined })).toContain("<p>none</p>");
    }),
  );
});

const RedirectPage = makeNextPage(
  runtime,
  Effect.succeed(
    NextRedirect.make({ url: "/star-wars", type: "replace" }),
  ),
);

describe("makeNextPage with a redirect outcome", () => {
  it.effect("hands the redirect to Next", () =>
    Effect.gen(function*() {
      const exit = yield* Effect.exit(
        Effect.promise(() =>
          RedirectPage({ searchParams: Promise.resolve({}) }),
        ),
      );

      expect(exit._tag).toBe("Failure");
      expect(redirect).toHaveBeenCalledWith("/star-wars", "replace");
    }),
  );
});
