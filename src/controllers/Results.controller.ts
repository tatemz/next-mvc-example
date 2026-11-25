import { Effect, Option, Schema } from "effect";
import { makeNotFoundViewModel } from "../components/NotFoundView";
import {
  makeResultsMissingViewModel,
  makeResultsViewModel,
} from "../components/ResultsView";
import { CharacterId } from "../domain/FilmUniverse.model";
import { I18n } from "../i18n/I18n.service";
import { decodeOption } from "../platform/ParsedSearchParams";
import { PeopleCatalog } from "../services/PeopleCatalog";
import { currentUniverse } from "./Universe.controller";

export const ResultsParams = Schema.Struct({
  character: CharacterId,
  film: Schema.NumberFromString.check(Schema.isInt()),
  transport: Schema.NonEmptyString,
});
export type ResultsParams = typeof ResultsParams.Type;

export const loadResults = Effect.gen(function*() {
  const i18n = yield* I18n;
  const universe = yield* currentUniverse;

  if (Option.isNone(universe)) {
    return makeNotFoundViewModel(i18n);
  }

  const params = yield* decodeOption(ResultsParams);

  if (Option.isNone(params)) {
    return makeResultsMissingViewModel(i18n, universe.value);
  }

  const client = yield* PeopleCatalog;
  const person = yield* Effect.option(
    client.getPerson(params.value.character),
  );
  return makeResultsViewModel(
    i18n,
    universe.value,
    person,
    params.value,
  );
});
