import { Effect, Function } from "effect";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { loadResults } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";

export const GhibliResultsPage = Function.pipe(
  loadResults("ghibli"),
  Effect.map((model) => (
    <ConnectedResultsView model={model} />
  )),
  makeNextPage,
);
