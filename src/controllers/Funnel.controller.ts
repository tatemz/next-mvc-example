import { Array, Effect, Function, Match, Option, Schema } from "effect";
import type { ExperienceTheme } from "../components/AppShell";
import {
  type FunnelViewModel,
  PersonChoiceViewModel,
  makeFunnelChooseViewModel,
  makeFunnelFailedViewModel,
  makeFunnelFilmViewModel,
  makeFunnelReviewViewModel,
  makeFunnelSearchViewModel,
  makeFunnelTransportViewModel,
} from "../components/Funnel";
import { makePersonViewModel } from "../components/PersonCard";
import { loadAppShell } from "./AppShell.controller";
import { CharacterId } from "../domain/FilmUniverse.model";
import { getStringOrEmpty, toRecord } from "../forms/FormData";
import { I18n } from "../i18n/I18n.service";
import { PeopleCatalog } from "../services/PeopleCatalog";

export const startFunnel = (theme: ExperienceTheme) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const shell = yield* loadAppShell(theme);
    return makeFunnelSearchViewModel(i18n, shell, "", undefined);
  });

const searchStep = (
  step: Extract<FunnelViewModel, { _tag: "Search" }>,
  formData: FormData,
) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const data = toRecord(formData);
    const query = getStringOrEmpty(data, "query").trim();

    if (query === "") {
      return makeFunnelSearchViewModel(
        i18n,
        step.shell,
        query,
        i18n._({ id: "funnel.search.required" }),
      );
    }

    const client = yield* PeopleCatalog;
    const results = yield* Effect.option(client.searchPeople(query));

    if (Option.isNone(results)) {
      return makeFunnelFailedViewModel(
        i18n,
        step.shell,
        i18n._({ id: "funnel.failed.message" }),
      );
    }

    const choices = Array.map(results.value, (person) =>
      PersonChoiceViewModel.make({ id: person.id, name: person.name }),
    );

    return Function.pipe(
      choices,
      Array.matchLeft({
        onEmpty: () =>
          makeFunnelSearchViewModel(
            i18n,
            step.shell,
            query,
            i18n._({ id: "funnel.search.noResults" }),
          ),
        onNonEmpty: (first, rest) =>
          makeFunnelChooseViewModel(i18n, step.shell, query, [first, ...rest]),
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
      getStringOrEmpty(data, "characterId"),
    );

    if (
      Option.isNone(characterId) ||
      !Array.some(
        step.results,
        (result) => result.id === characterId.value,
      )
    ) {
      return makeFunnelFailedViewModel(
        i18n,
        step.shell,
        i18n._({ id: "funnel.failed.invalidChoice" }),
      );
    }

    const client = yield* PeopleCatalog;
    const person = yield* Effect.option(
      client.getPerson(characterId.value),
    );

    if (Option.isNone(person)) {
      return makeFunnelFailedViewModel(
        i18n,
        step.shell,
        i18n._({ id: "funnel.failed.message" }),
      );
    }

    return makeFunnelFilmViewModel(
      i18n,
      step.shell,
      makePersonViewModel(i18n, person.value),
    );
  });

const filmStep = (
  step: Extract<FunnelViewModel, { _tag: "Film" }>,
  formData: FormData,
) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const data = toRecord(formData);
    const film = Option.flatMap(
      Schema.decodeUnknownOption(
        Schema.NumberFromString.check(Schema.isInt()),
      )(getStringOrEmpty(data, "order")),
      (order) =>
        Array.findFirst(
          step.person.films,
          (candidate) => candidate.order === order,
        ),
    );

    if (Option.isNone(film)) {
      return makeFunnelFailedViewModel(
        i18n,
        step.shell,
        i18n._({ id: "funnel.failed.invalidChoice" }),
      );
    }

    return makeFunnelTransportViewModel(
      i18n,
      step.shell,
      step.person,
      film.value,
    );
  });

const transportStep = (
  step: Extract<FunnelViewModel, { _tag: "Transport" }>,
  formData: FormData,
) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const data = toRecord(formData);
    const key = getStringOrEmpty(data, "transportKey");
    const transport = key === "none"
      ? Option.none()
      : Array.findFirst(
        step.person.transports,
        (candidate) => candidate.key === key,
      );

    if (key !== "none" && Option.isNone(transport)) {
      return makeFunnelFailedViewModel(
        i18n,
        step.shell,
        i18n._({ id: "funnel.failed.invalidChoice" }),
      );
    }

    return makeFunnelReviewViewModel(
      i18n,
      step.shell,
      step.person,
      step.film,
      Option.getOrNull(transport),
    );
  });

export const advanceFunnel = (
  previous: FunnelViewModel,
  formData: FormData,
) =>
  Match.valueTags(previous, {
    Search: (step) => searchStep(step, formData),
    Choose: (step) => chooseStep(step, formData),
    Film: (step) => filmStep(step, formData),
    Transport: (step) => transportStep(step, formData),
    Review: (step) => Effect.succeed<FunnelViewModel>(step),
    Failed: (step) => Effect.succeed<FunnelViewModel>(step),
  });
