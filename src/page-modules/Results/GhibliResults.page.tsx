import { Effect } from "effect";
import { Results } from "../../components/Results";
import { loadResultsPage } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";
import { ghibliRuntime } from "../../server/Runtime";

export const GhibliResultsPage = makeNextPage(
  ghibliRuntime,
  Effect.map(loadResultsPage("/ghibli", "autumn"), (model) => (
    <Results {...model} />
  )),
);
