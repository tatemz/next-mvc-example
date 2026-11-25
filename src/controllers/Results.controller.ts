import { Array, Effect, Option, Schema } from "effect";
import type {
  AppShellViewModel,
  ExperienceTheme,
} from "../components/AppShell";
import {
  makeResultsMissingViewModel,
  makeResultsReadyViewModel,
} from "../components/Results";
import { makePersonViewModel } from "../components/PersonCard";
import { CharacterId } from "../domain/FilmUniverse.model";
import { I18n } from "../i18n/I18n.service";
import { decodeOption } from "../platform/ParsedSearchParams";
import { PeopleCatalog } from "../services/PeopleCatalog";
import { loadAppShell } from "./AppShell.controller";

export const ResultsParams = Schema.Struct({
  character: CharacterId,
  film: Schema.NumberFromString.check(Schema.isInt()),
  transport: Schema.NonEmptyString,
});
export type ResultsParams = typeof ResultsParams.Type;

export const loadResults = (
  params: ResultsParams,
  basePath: string,
  shell: AppShellViewModel,
) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const client = yield* PeopleCatalog;
    const person = yield* Effect.option(client.getPerson(params.character));
    const startOverHref = `${basePath}/funnel`;

    if (Option.isNone(person)) {
      return makeResultsMissingViewModel(i18n, shell, startOverHref);
    }

    const personViewModel = makePersonViewModel(i18n, person.value);
    const film = Array.findFirst(
      personViewModel.films,
      (candidate) => candidate.order === params.film,
    );

    if (Option.isNone(film)) {
      return makeResultsMissingViewModel(i18n, shell, startOverHref);
    }

    const transport = params.transport === "none"
      ? null
      : Option.getOrNull(
        Array.findFirst(
          personViewModel.transports,
          (candidate) => candidate.key === params.transport,
        ),
      );

    if (params.transport !== "none" && transport === null) {
      return makeResultsMissingViewModel(i18n, shell, startOverHref);
    }

    return makeResultsReadyViewModel(
      i18n,
      shell,
      personViewModel,
      film.value,
      transport,
      startOverHref,
      basePath,
    );
  });

export const loadResultsPage = (
  basePath: string,
  theme: ExperienceTheme,
) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const shell = yield* loadAppShell(theme);
    const params = yield* decodeOption(ResultsParams);

    if (Option.isNone(params)) {
      return makeResultsMissingViewModel(
        i18n,
        shell,
        `${basePath}/funnel`,
      );
    }

    return yield* loadResults(params.value, basePath, shell);
  });
