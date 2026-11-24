import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import {
  PersonChoiceViewModel,
  makeFunnelChooseViewModel,
  makeFunnelFailedViewModel,
  makeFunnelFilmViewModel,
  makeFunnelReviewViewModel,
  makeFunnelSearchViewModel,
  makeFunnelTransportViewModel,
} from "../components/Funnel/Funnel";
import { makePersonViewModel } from "../components/PersonCard/PersonCard";
import { luke, makeCharacterId } from "../domain/StarWars.fixture";
import { I18n, makeEn } from "../i18n/I18n.service";
import { StarWarsClient, StarWarsError } from "../services/StarWarsClient";
import { layerStub } from "../services/StarWarsClient.layer";
import { advanceFunnel, startFunnel } from "./Funnel.controller";

const i18n = makeEn();

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
  searchPeople: StarWarsClient["searchPeople"] = () => Effect.succeed([]),
  getPerson: StarWarsClient["getPerson"] = () => Effect.succeed(luke),
) =>
  advanceFunnel(previous, data).pipe(
    Effect.provide(layerStub(getPerson, searchPeople)),
    Effect.provideService(I18n, i18n),
  );

const search = makeFunnelSearchViewModel(i18n);
const person = makePersonViewModel(i18n, luke);
const film = person.films[0];
const transport = person.transports[0];
const choice = PersonChoiceViewModel.make({
  id: "1",
  name: "Luke Skywalker",
});
const choose = makeFunnelChooseViewModel(i18n, "Luke", [choice]);
const filmStep = makeFunnelFilmViewModel(i18n, person);
const transportStep = makeFunnelTransportViewModel(i18n, person, film);
const review = makeFunnelReviewViewModel(i18n, person, film, transport);
const failed = makeFunnelFailedViewModel(i18n, "Nope");

describe("startFunnel", () => {
  it.effect("starts on the search step", () =>
    Effect.gen(function*() {
      const model = yield* startFunnel.pipe(
        Effect.provideService(I18n, i18n),
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
        () => Effect.fail(new StarWarsError({ message: "down" })),
      );

      expect(model).toMatchObject({
        _tag: "Failed",
        message: "The Star Wars API could not answer.",
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
        () => Effect.fail(new StarWarsError({ message: "down" })),
      );

      expect(model).toMatchObject({
        _tag: "Failed",
        message: "The Star Wars API could not answer.",
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
      const model = yield* run(filmStep, form({ episodeId: "99" }));

      expect(model).toMatchObject({
        _tag: "Failed",
        message: "That choice is no longer available.",
      });
    }),
  );

  it.effect("moves from the film to the transports", () =>
    Effect.gen(function*() {
      const model = yield* run(filmStep, form({ episodeId: "4" }));

      expect(model).toMatchObject({
        _tag: "Transport",
        film: { episodeId: 4 },
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
