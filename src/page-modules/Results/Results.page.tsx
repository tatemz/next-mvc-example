import { Effect, Function, Match } from "effect";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { NotFoundView } from "../../components/NotFoundView";
import { loadResults } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";
import { withUniverseServices } from "../withUniverseServices";

export const ResultsPage = Function.pipe(
  withUniverseServices(loadResults),
  Effect.map((model) =>
    Match.valueTags(model, {
      NotFoundViewModel: (notFound) => <NotFoundView model={notFound} />,
      Ready: (ready) => <ConnectedResultsView model={ready} />,
      Missing: (missing) => <ConnectedResultsView model={missing} />,
    })
  ),
  makeNextPage,
);
