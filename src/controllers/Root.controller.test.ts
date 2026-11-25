import { RedirectTypes } from "../platform/NextRedirect";
import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import { Locales } from "../i18n/Locale";
import { tag as pathParamsTag } from "../platform/ParsedPathParams";
import { loadRootPage } from "./Root.controller";

const run = (params: Record<string, string>) =>
  loadRootPage.pipe(Effect.provideService(pathParamsTag, params));

describe("loadRootPage", () => {
  it.effect("returns a redirect to the Star Wars home", () =>
    Effect.gen(function*() {
      expect(yield* run({})).toEqual({
        _tag: "NextRedirect",
        url: "/star-wars",
        type: RedirectTypes.Replace,
      });
    }),
  );

  it.effect("keeps the locale in the redirect", () =>
    Effect.gen(function*() {
      expect(yield* run({ locale: Locales.EsMX })).toEqual({
        _tag: "NextRedirect",
        url: "/es-MX/star-wars",
        type: RedirectTypes.Replace,
      });
    }),
  );
});
