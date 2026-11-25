import { Effect, Function } from "effect";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { loadResults } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";

export const StarWarsResultsPage = Function.pipe(
  loadResults("star-wars"),
  Effect.map((model) => (
    <ConnectedResultsView model={model} universe="star-wars" />
  )),
  makeNextPage,
);
