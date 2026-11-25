import { Effect, Option, Schema } from "effect";
import {
  makeResultsMissingViewModel,
  makeResultsViewModel,
} from "../components/ResultsView";
import { CharacterId, type Universe } from "../domain/FilmUniverse.model";
import { I18n } from "../i18n/I18n.service";
import { decodeOption } from "../platform/ParsedSearchParams";
import { PeopleCatalog } from "../services/PeopleCatalog";

export const ResultsParams = Schema.Struct({
  character: CharacterId,
  film: Schema.NumberFromString.check(Schema.isInt()),
  transport: Schema.NonEmptyString,
});
export type ResultsParams = typeof ResultsParams.Type;

export const loadResults = (universe: Universe) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const params = yield* decodeOption(ResultsParams);

    if (Option.isNone(params)) {
      return makeResultsMissingViewModel(i18n, universe);
    }

    const client = yield* PeopleCatalog;
    const person = yield* Effect.option(
      client.getPerson(params.value.character),
    );
    return makeResultsViewModel(i18n, universe, person, params.value);
  });
