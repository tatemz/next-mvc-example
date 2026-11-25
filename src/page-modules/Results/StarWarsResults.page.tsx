import { Effect } from "effect";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { loadResultsPage } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";
import { swapiRuntime } from "../../server/Runtime";

export const StarWarsResultsPage = makeNextPage(
  swapiRuntime,
  Effect.map(loadResultsPage("/star-wars", "night"), (model) => (
    <ConnectedResultsView model={model} universe="star-wars" />
  )),
);
