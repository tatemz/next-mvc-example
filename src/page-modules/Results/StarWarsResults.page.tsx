import { Effect } from "effect";
import { ConnectedResults } from "../../components/Results.connected";
import { loadResultsPage } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";
import { swapiRuntime } from "../../server/Runtime";

export const StarWarsResultsPage = makeNextPage(
  swapiRuntime,
  Effect.map(loadResultsPage("/star-wars", "night"), (model) => (
    <ConnectedResults model={model} universe="star-wars" />
  )),
);
