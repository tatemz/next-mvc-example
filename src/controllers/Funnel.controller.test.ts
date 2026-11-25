import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import {
  makeFunnelChooseViewModel,
  makeFunnelFailedViewModel,
  makeFunnelFilmViewModel,
  makeFunnelReviewViewModel,
  makeFunnelSearchViewModel,
  makeFunnelTransportViewModel,
} from "../components/FunnelView";
import { makePersonViewModel } from "../components/PersonCard";
import { makeAppShellViewModel } from "../components/AppShell";
import { luke, makeCharacterId } from "../domain/FilmUniverse.fixture";
import { I18n, makeEn } from "../i18n/I18n.service";
import { PeopleCatalog, PeopleCatalogError } from "../services/PeopleCatalog";
import { layerStub } from "../services/SwapiPeopleCatalog.layer";
import { tag as pathParamsTag } from "../platform/ParsedPathParams";
import { advanceFunnel, startFunnel } from "./Funnel.controller";

const i18n = makeEn();
const shell = makeAppShellViewModel(i18n, "star-wars");

const form = (values: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }
  return data;
};

const run = (
  previous: Parameters<typeof advanceFunnel>[0],
  data: FormData,
  searchPeople: PeopleCatalog["searchPeople"] = () => Effect.succeed([]),
  getPerson: PeopleCatalog["getPerson"] = () => Effect.succeed(luke),
) =>
  advanceFunnel(previous, data).pipe(
    Effect.provide(layerStub(getPerson, searchPeople)),
    Effect.provideService(I18n, i18n),
  );

const search = makeFunnelSearchViewModel(i18n, "star-wars", "", undefined);
const person = makePersonViewModel(i18n, luke);
const film = person.films[0];
const transport = person.transports[0];
const choice = { id: "1", name: "Luke Skywalker" };
const choose = makeFunnelChooseViewModel(i18n, shell, "Luke", [choice]);
const filmStep = makeFunnelFilmViewModel(i18n, shell, luke);
const transportStep = makeFunnelTransportViewModel(i18n, shell, person, film);
const review = makeFunnelReviewViewModel(i18n, shell, person, film, transport);
const failed = makeFunnelFailedViewModel(i18n, shell, "unavailable");

describe("startFunnel", () => {
  it.effect("starts on the search step", () =>
    Effect.gen(function*() {
      const model = yield* startFunnel.pipe(
        Effect.provideService(I18n, i18n),
        Effect.provideService(pathParamsTag, {
          universe: "star-wars",
        }),
      );

      expect(model).toMatchObject({
        _tag: "Search",
        query: "",
        stepLabel: "Step 1 of 4",
      });
    }),
  );
});

describe("advanceFunnel", () => {
  it.effect("requires a query", () =>
    Effect.gen(function*() {
      const model = yield* run(search, form({}));

      expect(model).toMatchObject({
        _tag: "Search",
        error: "Enter a character name.",
      });
    }),
  );

  it.effect("reports a search failure", () =>
    Effect.gen(function*() {
      const model = yield* run(
        search,
        form({ query: "Luke" }),
        () => Effect.fail(new PeopleCatalogError({ message: "down" })),
      );

      expect(model).toMatchObject({
        _tag: "Failed",
        message: "The character API could not answer.",
      });
    }),
  );

  it.effect("reports no search results", () =>
    Effect.gen(function*() {
      const model = yield* run(search, form({ query: "Nobody" }));

      expect(model).toMatchObject({
        _tag: "Search",
        error: "No characters matched that name.",
      });
    }),
  );

  it.effect("moves from search to the character choices", () =>
    Effect.gen(function*() {
      const model = yield* run(
        search,
        form({ query: "Luke" }),
        () =>
          Effect.succeed([
            {
              _tag: "PersonSummary",
              id: makeCharacterId("1"),
              name: "Luke Skywalker",
            },
          ]),
      );

      expect(model).toMatchObject({
        _tag: "Choose",
        query: "Luke",
        results: [{ id: "1", name: "Luke Skywalker" }],
      });
    }),
  );

  it.effect("rejects a missing character choice", () =>
    Effect.gen(function*() {
      const model = yield* run(choose, form({ characterId: "abc" }));

      expect(model).toMatchObject({
        _tag: "Failed",
        message: "That choice is no longer available.",
      });
    }),
  );

  it.effect("rejects a character outside the results", () =>
    Effect.gen(function*() {
      const model = yield* run(choose, form({ characterId: "2" }));

      expect(model).toMatchObject({
        _tag: "Failed",
        message: "That choice is no longer available.",
      });
    }),
  );

  it.effect("reports a character load failure", () =>
    Effect.gen(function*() {
      const model = yield* run(
        choose,
        form({ characterId: "1" }),
        undefined,
        () => Effect.fail(new PeopleCatalogError({ message: "down" })),
      );

      expect(model).toMatchObject({
        _tag: "Failed",
        message: "The character API could not answer.",
      });
    }),
  );

  it.effect("moves from the choice to the films", () =>
    Effect.gen(function*() {
      const model = yield* run(choose, form({ characterId: "1" }));

      expect(model).toMatchObject({
        _tag: "Film",
        person: { name: "Luke Skywalker" },
      });
    }),
  );

  it.effect("rejects a film outside the person", () =>
    Effect.gen(function*() {
      const model = yield* run(filmStep, form({ order: "99" }));

      expect(model).toMatchObject({
        _tag: "Failed",
        message: "That choice is no longer available.",
      });
    }),
  );

  it.effect("moves from the film to the transports", () =>
    Effect.gen(function*() {
      const model = yield* run(filmStep, form({ order: "4" }));

      expect(model).toMatchObject({
        _tag: "Transport",
        film: { order: 4 },
      });
    }),
  );

  it.effect("moves to the review without a transport", () =>
    Effect.gen(function*() {
      const model = yield* run(
        transportStep,
        form({ transportKey: "none" }),
      );

      expect(model).toMatchObject({
        _tag: "Review",
        transport: null,
      });
      if (model._tag !== "Review") throw new Error("expected Review");
      expect(model.resultsHref).toContain("transport=none");
    }),
  );

  it.effect("rejects a transport outside the person", () =>
    Effect.gen(function*() {
      const model = yield* run(
        transportStep,
        form({ transportKey: "starship-99" }),
      );

      expect(model).toMatchObject({
        _tag: "Failed",
        message: "That choice is no longer available.",
      });
    }),
  );

  it.effect("rejects a missing transport choice", () =>
    Effect.gen(function*() {
      const model = yield* run(transportStep, form({}));

      expect(model).toMatchObject({
        _tag: "Failed",
        message: "That choice is no longer available.",
      });
    }),
  );

  it.effect("moves to the review with a transport", () =>
    Effect.gen(function*() {
      const model = yield* run(
        transportStep,
        form({ transportKey: "starship-12" }),
      );

      expect(model).toMatchObject({
        _tag: "Review",
        transport: { key: "starship-12", name: "X-wing" },
      });
    }),
  );

  it.effect("keeps the review state", () =>
    Effect.gen(function*() {
      const model = yield* run(review, form({}));

      expect(model).toEqual(review);
    }),
  );

  it.effect("keeps the failure state", () =>
    Effect.gen(function*() {
      const model = yield* run(failed, form({}));

      expect(model).toEqual(failed);
    }),
  );
});
