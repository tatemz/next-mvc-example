import { Effect, Function } from "effect";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { loadResults } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";

export const ResultsPage = Function.pipe(
  loadResults,
  Effect.map((model) => <ConnectedResultsView model={model} />),
  makeNextPage,
);
