import { Effect, Schema } from "effect";
import {
  makeResultsMissingViewModel,
  makeResultsReadyViewModel,
} from "../components/Results/Results";
import { makePersonViewModel } from "../components/PersonCard/PersonCard";
import { CharacterId } from "../domain/FilmUniverse.model";
import { I18n } from "../i18n/I18n.service";
import { PeopleCatalog } from "../services/PeopleCatalog";

export const ResultsParams = Schema.Struct({
  character: CharacterId,
  film: Schema.NumberFromString.check(Schema.isInt()),
  transport: Schema.optional(Schema.String),
});
export type ResultsParams = typeof ResultsParams.Type;

export const loadResults = (params: ResultsParams) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const client = yield* PeopleCatalog;
    const person = yield* client.getPerson(params.character).pipe(
      Effect.match({
        onFailure: () => undefined,
        onSuccess: (loaded) => loaded,
      }),
    );

    if (person === undefined) {
      return makeResultsMissingViewModel(i18n);
    }

    const personViewModel = makePersonViewModel(i18n, person);
    const film = personViewModel.films.find(
      (candidate) => candidate.order === params.film,
    );

    if (film === undefined) {
      return makeResultsMissingViewModel(i18n);
    }

    const transportKey = params.transport ?? "none";
    const transport =
      transportKey === "none"
        ? null
        : personViewModel.transports.find(
            (candidate) => candidate.key === transportKey,
          ) ?? null;

    if (transportKey !== "none" && transport === null) {
      return makeResultsMissingViewModel(i18n);
    }

    return makeResultsReadyViewModel(
      i18n,
      personViewModel,
      film,
      transport,
    );
  });
