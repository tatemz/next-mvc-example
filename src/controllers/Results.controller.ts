import { Effect, Option, Schema } from "effect";
import {
  makeResultsMissingViewModel,
  makeResultsViewModel,
} from "../components/ResultsView";
import { CharacterId } from "../domain/FilmUniverse.model";
import type { UniverseServices } from "../page-modules/withUniverseServices";
import { decodeOption } from "../platform/ParsedSearchParams";

export const ResultsParams = Schema.Struct({
  character: CharacterId,
  film: Schema.NumberFromString.check(Schema.isInt()),
  transport: Schema.NonEmptyString,
});
export type ResultsParams = typeof ResultsParams.Type;

export const loadResults = (services: UniverseServices) =>
  Effect.gen(function*() {
    const params = yield* decodeOption(ResultsParams);

    if (Option.isNone(params)) {
      return makeResultsMissingViewModel(
        services.i18n,
        services.universe,
      );
    }

    const person = yield* Effect.option(
      services.catalog.getPerson(params.value.character),
    );
    return makeResultsViewModel(
      services.i18n,
      services.universe,
      person,
      params.value,
    );
  });
