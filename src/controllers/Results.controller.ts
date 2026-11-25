import { Effect, Option, Schema } from "effect";
import { makeResultsPageViewModel } from "../components/ResultsView";
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
  const params = yield* decodeOption(ResultsParams);
  const client = yield* PeopleCatalog;
  const person = Option.isSome(universe) && Option.isSome(params)
    ? yield* Effect.option(client.getPerson(params.value.character))
    : Option.none();

  return makeResultsPageViewModel(
    i18n,
    universe,
    Option.map(params, ({ film, transport }) => ({ film, transport })),
    person,
  );
});
