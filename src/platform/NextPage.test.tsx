import { it } from "@effect/vitest";
import { Effect, Option, Schema } from "effect";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { makeNextPage, type NextSearchParams } from "./NextPage";

const Params = Schema.Struct({
  id: Schema.NumberFromString,
});

const runtime = { runPromise: Effect.runPromise };

const Page = makeNextPage({
  runtime,
  searchParams: Params,
  load: (params: Option.Option<{ id: number }>) => Effect.succeed(params),
  view: (params: Option.Option<{ id: number }>) =>
    Option.match(params, {
      onNone: () => <p>none</p>,
      onSome: (value) => <p>{value.id}</p>,
    }),
});

const render = (searchParams: NextSearchParams) =>
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
