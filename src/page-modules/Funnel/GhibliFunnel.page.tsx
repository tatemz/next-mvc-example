import { Effect } from "effect";
import { submitGhibliFunnel } from "../../actions/GhibliFunnel.serverAction";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import { startFunnel } from "../../controllers/Funnel.controller";
import { makeNextPage } from "../../platform/NextPage";
import { ghibliRuntime } from "../../server/Runtime";

export const GhibliFunnelPage = makeNextPage(
  ghibliRuntime,
  Effect.map(startFunnel("autumn"), (model) => (
    <ConnectedFunnelView
      model={model}
      submitAction={submitGhibliFunnel}
      universe="ghibli"
    />
  )),
);
