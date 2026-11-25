import { it } from "@effect/vitest";
import { Effect, Match, Option, Schema } from "effect";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string, type?: string) => {
    throw new Error(`NEXT_REDIRECT;${type};${url}`);
  }),
}));

import { redirect } from "next/navigation";
import {
  makeCharacterId,
  personNamed,
} from "../domain/FilmUniverse.fixture";
import { Universes } from "../domain/FilmUniverse.model";
import { I18nCatalog } from "../i18n/I18n.service";
import { Locales } from "../i18n/Locale";
import { Catalogs } from "../services/Catalogs";
import { makeNextPage } from "./NextPage";
import { NextRedirect, RedirectTypes } from "./NextRedirect";
import { type ParsedSearchParams, decodeOption } from "./ParsedSearchParams";
import { renderContext } from "../server/RenderContext.fixture";
import { runInRenderContext } from "../server/RenderContext";

const Params = Schema.Struct({
  id: Schema.NumberFromString.check(Schema.isInt()),
});

const context = renderContext({
  ghibli: [personNamed(makeCharacterId("2"), "Ghibli")],
});

const Page = makeNextPage(
  Effect.gen(function*() {
    const i18n = (yield* I18nCatalog)[Locales.EnUS];
    const catalogs = yield* Catalogs;
    const people = yield* catalogs[Universes.Ghibli].searchPeople("");
    const params = yield* decodeOption(Params);
    return (
      <p>
        {i18n._({ id: "funnel.search.noResults" })}|{people[0]?.name}|
        {Option.match(params, {
          onNone: () => "none",
          onSome: (value) => value.id,
        })}
      </p>
    );
  }),
);

const render = (searchParams: ParsedSearchParams) =>
  Effect.promise(() =>
    runInRenderContext(
      context,
      () => Page({ searchParams: Promise.resolve(searchParams) }),
    ),
  ).pipe(Effect.map(renderToStaticMarkup));

describe("makeNextPage", () => {
  it.effect("provides the request context and decoded params", () =>
    Effect.gen(function*() {
      const html = yield* render({ id: "3" });

      expect(html).toContain("No characters matched that name.");
      expect(html).toContain("Ghibli|3");
    }),
  );

  it.effect("takes the first value of an array search param", () =>
    Effect.gen(function*() {
      expect(yield* render({ id: ["4", "5"] })).toContain("Ghibli|4");
    }),
  );

  it.effect("passes none when a required param is missing", () =>
    Effect.gen(function*() {
      expect(yield* render({})).toContain("Ghibli|none");
      expect(yield* render({ id: undefined })).toContain("Ghibli|none");
    }),
  );
});

const RedirectPage = makeNextPage(
  Effect.succeed(
    NextRedirect.make({ url: "/star-wars", type: RedirectTypes.Replace }),
  ),
);

describe("makeNextPage with a redirect outcome", () => {
  it.effect("hands the redirect to Next", () =>
    Effect.gen(function*() {
      const exit = yield* Effect.exit(
        Effect.promise(() =>
          runInRenderContext(
            context,
            () => RedirectPage({ searchParams: Promise.resolve({}) }),
          ),
        ),
      );

      expect(
        Match.valueTags(exit, {
          Success: () => false,
          Failure: () => true,
        }),
      ).toBe(true);
      expect(redirect).toHaveBeenCalledWith("/star-wars", RedirectTypes.Replace);
    }),
  );
});
