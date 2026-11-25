import { it } from "@effect/vitest";
import { Effect, Option, Schema } from "effect";
import { describe, expect } from "vitest";
import {
  decodeOption,
  fromInput,
  tag,
  type ParsedSearchParams,
} from "./ParsedSearchParams";

const Params = Schema.Struct({
  id: Schema.NumberFromString.check(Schema.isInt()),
});

const decode = (params: ParsedSearchParams) =>
  decodeOption(Params).pipe(Effect.provideService(tag, fromInput(params)));

describe("decodeOption", () => {
  it.effect("decodes the provided search params", () =>
    Effect.gen(function*() {
      expect(yield* decode({ id: "3" })).toEqual(Option.some({ id: 3 }));
    }),
  );

  it.effect("takes the first value of a repeated key", () =>
    Effect.gen(function*() {
      expect(yield* decode({ id: ["4", "5"] })).toEqual(Option.some({ id: 4 }));
    }),
  );

  it.effect("returns none for a missing or invalid value", () =>
    Effect.gen(function*() {
      expect(yield* decode({})).toEqual(Option.none());
      expect(yield* decode({ id: "x" })).toEqual(Option.none());
    }),
  );
});
