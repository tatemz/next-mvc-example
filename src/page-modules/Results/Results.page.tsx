import { Effect, Option } from "effect";
import {
  Results,
  makeResultsMissingViewModel,
} from "../../components/Results/Results";
import {
  loadResults,
  ResultsParams,
} from "../../controllers/Results.controller";
import { I18n } from "../../i18n/I18n.service";
import { makeNextPage } from "../../platform/NextPage";
import { swapiRuntime } from "../../server/Runtime";

const resultsPage = (params: Option.Option<ResultsParams>) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;

    if (Option.isNone(params)) {
      return makeResultsMissingViewModel(i18n);
    }

    return yield* loadResults(params.value);
  });

export const ResultsPage = makeNextPage({
  runtime: swapiRuntime,
  searchParams: ResultsParams,
  load: resultsPage,
  view: (model) => <Results {...model} />,
});
