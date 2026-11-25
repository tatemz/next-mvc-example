import { Effect } from "effect";
import { submitFunnel } from "../../actions/Funnel.serverAction";
import { ConnectedFunnel } from "../../components/Funnel.connected";
import { startFunnel } from "../../controllers/Funnel.controller";
import { makeNextPage } from "../../platform/NextPage";
import { swapiRuntime } from "../../server/Runtime";

export const StarWarsFunnelPage = makeNextPage(
  swapiRuntime,
  Effect.map(startFunnel("night"), (model) => (
    <ConnectedFunnel model={model} submitAction={submitFunnel} />
  )),
);
