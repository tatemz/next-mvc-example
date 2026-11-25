import { Effect } from "effect";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { loadResultsPage } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";

export const GhibliResultsPage = makeNextPage(
  Effect.map(loadResultsPage("/ghibli", "autumn"), (model) => (
    <ConnectedResultsView model={model} universe="ghibli" />
  )),
);
