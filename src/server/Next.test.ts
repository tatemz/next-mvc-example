import { it } from "@effect/vitest";
import { Context, Effect, Layer, Option } from "effect";
import {
  FetchHttpClient,
  HttpClient,
  HttpClientResponse,
  HttpServerResponse,
} from "effect/http";
import { describe, expect } from "vitest";
import { appWith } from "../../boot/app";
import { serve } from "../../boot/serve";
import {
  makeCharacterId,
  personNamed,
} from "../domain/FilmUniverse.fixture";
import { catalogOf } from "../services/PeopleCatalog.fixture";
import { PeopleCatalog } from "../services/PeopleCatalog";
import type { RenderServices } from "./RenderContext";
import { Next } from "./Next";

const catalogServing = (name: string) =>
  catalogOf([personNamed(makeCharacterId("1"), name)]);

const fakeNext = Layer.succeed(
  Next,
  Next.of({
    render: (_request, context) =>
      Effect.gen(function*() {
        const catalog = Context.getOption(
          context as Context.Context<RenderServices>,
          PeopleCatalog,
        );
        if (Option.isNone(catalog)) {
          return HttpServerResponse.text("no catalog");
        }
        const people = yield* catalog.value.searchPeople("").pipe(
          Effect.orDie,
        );
        return HttpServerResponse.text(people[0]?.name ?? "empty");
      }),
  }),
);

const appWithFakes = appWith({
  next: fakeNext,
  catalogs: {
    "star-wars": catalogServing("Luke"),
    ghibli: catalogServing("Haku"),
  },
});

const body = (url: string) =>
  HttpClient.get(url).pipe(
    Effect.flatMap(HttpClientResponse.filterStatusOk),
    Effect.flatMap((response) => response.text),
  );

describe("app routes", () => {
  it.effect(
    "gives each universe route its catalog and other routes none",
    () =>
      Effect.gen(function*() {
        const url = yield* serve(0)(appWithFakes);

        expect(yield* body(`${url}/star-wars`)).toBe("Luke");
        expect(yield* body(`${url}/star-wars/funnel`)).toBe("Luke");
        expect(yield* body(`${url}/ghibli`)).toBe("Haku");
        expect(yield* body(`${url}/ghibli/results`)).toBe("Haku");
        expect(yield* body(`${url}/`)).toBe("no catalog");
        expect(yield* body(`${url}/_next/static/chunk.js`)).toBe(
          "no catalog",
        );
      }).pipe(Effect.scoped, Effect.provide(FetchHttpClient.layer)),
  );
});
