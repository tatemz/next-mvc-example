import {
  Effect,
  Match,
  Option,
  type Config,
  type ManagedRuntime,
} from "effect";
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
import { decodeOption } from "../../platform/ParsedSearchParams";
import type { PeopleCatalog } from "../../services/PeopleCatalog";

export type ResultsRuntime = ManagedRuntime.ManagedRuntime<
  I18n | PeopleCatalog,
  Config.ConfigError
>;

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

const resultsPage = (basePath: string) =>
  Effect.gen(function*() {
    const i18n = yield* I18n;
    const params = yield* decodeOption(ResultsParams);
    const model = yield* (Option.isNone(params)
      ? Effect.succeed(makeResultsMissingViewModel(i18n))
      : loadResults(params.value));

    return withDatasetLinks(basePath)(model);
  });

export const makeResultsPage = (
  runtime: ResultsRuntime,
  basePath: string,
) =>
  makeNextPage(
    runtime,
    Effect.map(resultsPage(basePath), (model) => (
      <Results {...model} />
    )),
  );
