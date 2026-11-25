import { RedirectTypes } from "../platform/NextRedirect";
import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import { loadRootPage } from "./Root.controller";

describe("loadRootPage", () => {
  it.effect("returns a redirect to the Star Wars home", () =>
    Effect.gen(function*() {
      expect(yield* loadRootPage).toEqual({
        _tag: "NextRedirect",
        url: "/star-wars",
        type: RedirectTypes.Replace,
      });
    }),
  );
});
