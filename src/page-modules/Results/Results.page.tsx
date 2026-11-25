import { Effect, Function } from "effect";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { NotFoundView } from "../../components/NotFoundView";
import { loadResults } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";
import { withUniverseServices } from "../withUniverseServices";

export const ResultsPage = Function.pipe(
  withUniverseServices(loadResults),
  Effect.map((model) =>
    model._tag === "NotFoundViewModel"
      ? <NotFoundView model={model} />
      : <ConnectedResultsView model={model} />
  ),
  makeNextPage,
);
