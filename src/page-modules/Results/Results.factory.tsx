import { Effect, Match, Option } from "effect";
import {
  Results,
  makeResultsMissingViewModel,
  type ResultsViewModel,
} from "../../components/Results/Results";
import {
  loadResults,
  ResultsParams,
} from "../../controllers/Results.controller";
import { I18n } from "../../i18n/I18n.service";
import { makeNextPage } from "../../platform/NextPage";
import type { PeopleCatalog } from "../../services/PeopleCatalog";

export type ResultsRuntime = {
  readonly runPromise: <A, E>(
    effect: Effect.Effect<A, E, I18n | PeopleCatalog>,
  ) => Promise<A>;
};

const withDatasetLinks =
  (basePath: string) =>
  (model: ResultsViewModel): ResultsViewModel =>
    Match.value(model).pipe(
      Match.tag("Ready", (ready) => ({
        ...ready,
        startOverHref: `${basePath}/funnel`,
        homeHref: basePath,
      })),
      Match.tag("Missing", (missing) => ({
        ...missing,
        startOverHref: `${basePath}/funnel`,
      })),
      Match.exhaustive,
    );

const resultsPage =
  (basePath: string) => (params: Option.Option<ResultsParams>) =>
    Effect.gen(function*() {
      const i18n = yield* I18n;
      const model = yield* (Option.isNone(params)
        ? Effect.succeed(makeResultsMissingViewModel(i18n))
        : loadResults(params.value));

      return withDatasetLinks(basePath)(model);
    });

export const makeResultsPage = (
  runtime: ResultsRuntime,
  basePath: string,
) =>
  makeNextPage({
    runtime,
    searchParams: ResultsParams,
    load: resultsPage(basePath),
    view: (model) => <Results {...model} />,
  });
