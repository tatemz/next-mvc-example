import { Array, Effect, Function, Match, Option, Schema } from "effect";
import {
  type FunnelViewModel,
  PersonChoiceViewModel,
  makeFunnelChooseViewModel,
  makeFunnelFailedViewModel,
  makeFunnelFilmViewModel,
  makeFunnelReviewViewModel,
  makeFunnelSearchViewModel,
  makeFunnelTransportViewModel,
} from "../components/Funnel/Funnel";
import { makePersonViewModel } from "../components/PersonCard/PersonCard";
import { CharacterId } from "../domain/StarWars.model";
import { getString, toRecord } from "../forms/FormData";
import { I18n } from "../i18n/I18n.service";
import { StarWarsClient } from "../services/StarWarsClient";

export const startFunnel = Effect.gen(function*() {
  const i18n = yield* I18n;
  return makeFunnelSearchViewModel(i18n);
});

const searchStep = (
  _step: Extract<FunnelViewModel, { _tag: "Search" }>,
  formData: FormData,
) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const data = toRecord(formData);
    const query = getString(data, "query").trim();

    if (query === "") {
      return makeFunnelSearchViewModel(
        i18n,
        query,
        i18n._({ id: "funnel.search.required" }),
      );
    }

    const client = yield* StarWarsClient;
    const results = yield* client.searchPeople(query).pipe(
      Effect.match({
        onFailure: () => undefined,
        onSuccess: (people) => people,
      }),
    );

    if (results === undefined) {
      return makeFunnelFailedViewModel(
        i18n,
        i18n._({ id: "funnel.failed.message" }),
      );
    }

    const choices = Array.map(results, (person) =>
      PersonChoiceViewModel.make({ id: person.id, name: person.name }),
    );

    return Function.pipe(
      choices,
      Array.matchLeft({
        onEmpty: () =>
          makeFunnelSearchViewModel(
            i18n,
            query,
            i18n._({ id: "funnel.search.noResults" }),
          ),
        onNonEmpty: (first, rest) =>
          makeFunnelChooseViewModel(i18n, query, [first, ...rest]),
      }),
    );
  });

const chooseStep = (
  step: Extract<FunnelViewModel, { _tag: "Choose" }>,
  formData: FormData,
) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const data = toRecord(formData);
    const characterId = Schema.decodeUnknownOption(CharacterId)(
      getString(data, "characterId"),
    );

    if (
      Option.isNone(characterId) ||
      !step.results.some((result) => result.id === characterId.value)
    ) {
      return makeFunnelFailedViewModel(
        i18n,
        i18n._({ id: "funnel.failed.invalidChoice" }),
      );
    }

    const client = yield* StarWarsClient;
    const person = yield* client.getPerson(characterId.value).pipe(
      Effect.match({
        onFailure: () => undefined,
        onSuccess: (loaded) => loaded,
      }),
    );

    if (person === undefined) {
      return makeFunnelFailedViewModel(
        i18n,
        i18n._({ id: "funnel.failed.message" }),
      );
    }

    return makeFunnelFilmViewModel(i18n, makePersonViewModel(i18n, person));
  });

const filmStep = (
  step: Extract<FunnelViewModel, { _tag: "Film" }>,
  formData: FormData,
) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const data = toRecord(formData);
    const episodeId = Number(getString(data, "episodeId"));
    const film = step.person.films.find(
      (candidate) => candidate.episodeId === episodeId,
    );

    if (film === undefined) {
      return makeFunnelFailedViewModel(
        i18n,
        i18n._({ id: "funnel.failed.invalidChoice" }),
      );
    }

    return makeFunnelTransportViewModel(i18n, step.person, film);
  });

const transportStep = (
  step: Extract<FunnelViewModel, { _tag: "Transport" }>,
  formData: FormData,
) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const data = toRecord(formData);
    const key = getString(data, "transportKey");
    const transport =
      key === "none"
        ? null
        : step.person.transports.find((candidate) => candidate.key === key);

    if (key !== "none" && transport === undefined) {
      return makeFunnelFailedViewModel(
        i18n,
        i18n._({ id: "funnel.failed.invalidChoice" }),
      );
    }

    return makeFunnelReviewViewModel(
      i18n,
      step.person,
      step.film,
      transport ?? null,
    );
  });

export const advanceFunnel = (
  previous: FunnelViewModel,
  formData: FormData,
) =>
  Match.value(previous).pipe(
    Match.tag("Search", (step) => searchStep(step, formData)),
    Match.tag("Choose", (step) => chooseStep(step, formData)),
    Match.tag("Film", (step) => filmStep(step, formData)),
    Match.tag("Transport", (step) => transportStep(step, formData)),
    Match.tag("Review", (step) => Effect.succeed<FunnelViewModel>(step)),
    Match.tag("Failed", (step) => Effect.succeed<FunnelViewModel>(step)),
    Match.exhaustive,
  );
