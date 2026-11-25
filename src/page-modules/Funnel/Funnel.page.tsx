import { Effect, Function } from "effect";
import { submitFunnel } from "../../actions/Funnel.serverAction";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import { NotFoundView } from "../../components/NotFoundView";
import { startFunnel } from "../../controllers/Funnel.controller";
import { makeNextPage } from "../../platform/NextPage";
import { withUniverseServices } from "../withUniverseServices";

export const FunnelPage = Function.pipe(
  withUniverseServices((services) => Effect.succeed(startFunnel(services))),
  Effect.map((model) =>
    model._tag === "NotFoundViewModel"
      ? <NotFoundView model={model} />
      : <ConnectedFunnelView model={model} submitAction={submitFunnel} />
  ),
  makeNextPage,
);
