import { Effect } from "effect";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { loadResultsPage } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";

export const StarWarsResultsPage = makeNextPage(
  Effect.map(loadResultsPage("star-wars"), (model) => (
    <ConnectedResultsView model={model} universe="star-wars" />
  )),
);
