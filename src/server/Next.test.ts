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
import { Universes } from "../domain/FilmUniverse.model";
import { Catalogs } from "../services/Catalogs";
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
        const services = context as Context.Context<RenderServices>;
        const catalogs = Context.getOption(services, Catalogs);
        const selected = Context.getOption(services, PeopleCatalog);
        if (Option.isNone(catalogs) || Option.isSome(selected)) {
          return HttpServerResponse.text("unexpected context");
        }
        const [starWars, ghibli] = yield* Effect.all([
          catalogs.value[Universes.StarWars].searchPeople(""),
          catalogs.value[Universes.Ghibli].searchPeople(""),
        ]).pipe(Effect.orDie);
        return HttpServerResponse.text(
          `${starWars[0]?.name}/${ghibli[0]?.name}`,
        );
      }),
  }),
);

const appWithFakes = appWith({
  next: fakeNext,
  catalogs: {
    [Universes.StarWars]: catalogServing("Luke"),
    [Universes.Ghibli]: catalogServing("Haku"),
  },
});

const body = (url: string) =>
  HttpClient.get(url).pipe(
    Effect.flatMap(HttpClientResponse.filterStatusOk),
    Effect.flatMap((response) => response.text),
  );

describe("app routes", () => {
  it.effect("gives the single catch-all the catalog registry", () =>
    Effect.gen(function*() {
      const url = yield* serve(0)(appWithFakes);

      expect(yield* body(`${url}/star-wars`)).toBe("Luke/Haku");
      expect(yield* body(`${url}/ghibli/funnel`)).toBe("Luke/Haku");
      expect(yield* body(`${url}/`)).toBe("Luke/Haku");
      expect(yield* body(`${url}/_next/static/chunk.js`)).toBe("Luke/Haku");
    }).pipe(Effect.scoped, Effect.provide(FetchHttpClient.layer)),
  );
});
