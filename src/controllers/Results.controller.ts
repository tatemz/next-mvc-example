import { Effect, Option, Schema } from "effect";
import {
  makeResultsMissingViewModel,
  makeResultsReadyViewModel,
} from "../components/Results/Results";
import { makePersonViewModel } from "../components/PersonCard/PersonCard";
import { CharacterId } from "../domain/FilmUniverse.model";
import { I18n } from "../i18n/I18n.service";
import { PeopleCatalog } from "../services/PeopleCatalog";

export type ResultsSearchParams = Readonly<
  Record<string, string | ReadonlyArray<string> | undefined>
>;

const first = (value: string | ReadonlyArray<string> | undefined) =>
  typeof value === "string" ? value : value?.[0];

const ResultsParams = Schema.Struct({
  character: CharacterId,
  film: Schema.NumberFromString.check(Schema.isInt()),
  transport: Schema.String,
});

export const loadResults = (params: ResultsSearchParams) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const decoded = Schema.decodeUnknownOption(ResultsParams)({
      character: first(params.character) ?? "",
      film: first(params.film) ?? "",
      transport: first(params.transport) ?? "none",
    });

    if (Option.isNone(decoded)) {
      return makeResultsMissingViewModel(i18n);
    }

    const client = yield* PeopleCatalog;
    const person = yield* client.getPerson(decoded.value.character).pipe(
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
      (candidate) => candidate.order === decoded.value.film,
    );

    if (film === undefined) {
      return makeResultsMissingViewModel(i18n);
    }

    const transport =
      decoded.value.transport === "none"
        ? null
        : personViewModel.transports.find(
            (candidate) => candidate.key === decoded.value.transport,
          ) ?? null;

    if (decoded.value.transport !== "none" && transport === null) {
      return makeResultsMissingViewModel(i18n);
    }

    return makeResultsReadyViewModel(
      i18n,
      personViewModel,
      film,
      transport,
    );
  });
