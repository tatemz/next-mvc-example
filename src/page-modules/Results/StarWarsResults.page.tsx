import { Effect } from "effect";
import { Results } from "../../components/Results";
import { loadResultsPage } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";
import { swapiRuntime } from "../../server/Runtime";

export const StarWarsResultsPage = makeNextPage(
  swapiRuntime,
  Effect.map(loadResultsPage("/star-wars", "night"), (model) => (
    <Results {...model} />
  )),
);
