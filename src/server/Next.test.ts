import { it } from "@effect/vitest";
import { NodeHttpServer } from "@effect/platform-node";
import { Context, Effect, Layer, Option } from "effect";
import {
  FetchHttpClient,
  HttpClient,
  HttpClientResponse,
  HttpRouter,
  HttpServerResponse,
} from "effect/http";
import { describe, expect } from "vitest";
import { serve } from "../../boot/serve";
import { makeCharacterId } from "../domain/FilmUniverse.fixture";
import { PersonSummary } from "../domain/FilmUniverse.model";
import { I18n, makeEn } from "../i18n/I18n.service";
import {
  GhibliCatalog,
  PeopleCatalog,
  StarWarsCatalog,
} from "../services/PeopleCatalog";
import type { RenderServices } from "./RenderContext";
import { Next, nextCatchAll } from "./Next";

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

const asPeopleCatalog = <I>(
  tag: Context.Key<I, PeopleCatalog>,
): Layer.Layer<PeopleCatalog, never, I> =>
  Layer.effect(PeopleCatalog, Effect.map(tag, (catalog) => catalog));

const universeRoutes = (
  path: `/${string}`,
  catalog: Layer.Layer<PeopleCatalog, never, StarWarsCatalog | GhibliCatalog>,
) =>
  HttpRouter.provideRequest(
    Layer.mergeAll(Layer.sync(I18n, makeEn), catalog),
  )(
    Layer.mergeAll(nextCatchAll(path), nextCatchAll(`${path}/*`)),
  );

const app = HttpRouter.serve(
  Layer.mergeAll(
    universeRoutes("/star-wars", asPeopleCatalog(StarWarsCatalog)),
    universeRoutes("/ghibli", asPeopleCatalog(GhibliCatalog)),
    nextCatchAll("*"),
  ),
  { disableLogger: true, disableListenLog: true },
).pipe(
  Layer.provide(fakeNext),
  Layer.provide(Layer.succeed(StarWarsCatalog, catalogServing("Luke"))),
  Layer.provide(Layer.succeed(GhibliCatalog, catalogServing("Haku"))),
  Layer.provide(NodeHttpServer.layerHttpServices),
);

const body = (url: string) =>
  HttpClient.get(url).pipe(
    Effect.flatMap(HttpClientResponse.filterStatusOk),
    Effect.flatMap((response) => response.text),
  );

describe("nextCatchAll", () => {
  it.effect(
    "gives each universe route its catalog and other routes none",
    () =>
      Effect.gen(function*() {
        const url = yield* serve(0)(app);

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
