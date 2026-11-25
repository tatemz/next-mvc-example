import { Effect } from "effect";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { loadResults } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";

export const GhibliResultsPage = makeNextPage(
  Effect.map(loadResults("ghibli"), (model) => (
    <ConnectedResultsView model={model} universe="ghibli" />
  )),
);
