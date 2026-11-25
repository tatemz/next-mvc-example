import { Effect } from "effect";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { loadResults } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";

export const StarWarsResultsPage = makeNextPage(
  Effect.map(loadResults("star-wars"), (model) => (
    <ConnectedResultsView model={model} universe="star-wars" />
  )),
);
