import { Effect } from "effect";
import { ConnectedResults } from "../../components/Results.connected";
import { loadResultsPage } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";
import { ghibliRuntime } from "../../server/Runtime";

export const GhibliResultsPage = makeNextPage(
  ghibliRuntime,
  Effect.map(loadResultsPage("/ghibli", "autumn"), (model) => (
    <ConnectedResults model={model} universe="ghibli" />
  )),
);
