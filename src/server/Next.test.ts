import { it } from "@effect/vitest";
import { NodeHttpServer } from "@effect/platform-node";
import { Context, Effect, Layer, Option } from "effect";
import {
  FetchHttpClient,
  HttpClient,
  HttpClientResponse,
  HttpServerResponse,
} from "effect/http";
import { describe, expect } from "vitest";
import { app } from "../../boot/app";
import { serve } from "../../boot/serve";
import { makeCharacterId } from "../domain/FilmUniverse.fixture";
import { PersonSummary } from "../domain/FilmUniverse.model";
import {
  GhibliCatalog,
  PeopleCatalog,
  StarWarsCatalog,
} from "../services/PeopleCatalog";
import type { RenderServices } from "./RenderContext";
import { Next } from "./Next";
import { UiEventLogger, noopUiEventLogger } from "./UiEventLogger";

const catalogServing = (name: string): PeopleCatalog => ({
  getPerson: () => Effect.die("getPerson is not used here"),
  searchPeople: () =>
    Effect.succeed([
      PersonSummary.make({ id: makeCharacterId("1"), name }),
    ]),
});

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

const appWithFakes = app.pipe(
  Layer.provide(fakeNext),
  Layer.provide(Layer.succeed(StarWarsCatalog, catalogServing("Luke"))),
  Layer.provide(Layer.succeed(GhibliCatalog, catalogServing("Haku"))),
  Layer.provide(Layer.succeed(UiEventLogger, noopUiEventLogger)),
  Layer.provide(NodeHttpServer.layerHttpServices),
);

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
