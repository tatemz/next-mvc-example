import { Effect, Function } from "effect";
import { ConnectedResultsView } from "../../components/ResultsView.connected";
import { NotFoundView } from "../../components/NotFoundView";
import { loadResults } from "../../controllers/Results.controller";
import { makeNextPage } from "../../platform/NextPage";

export const ResultsPage = Function.pipe(
  loadResults,
  Effect.map((model) =>
    model._tag === "NotFoundViewModel"
      ? <NotFoundView model={model} />
      : <ConnectedResultsView model={model} />
  ),
  makeNextPage,
);
