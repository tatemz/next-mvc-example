import { Effect } from "effect";
import { submitGhibliFunnel } from "../../actions/GhibliFunnel.serverAction";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import { startFunnel } from "../../controllers/Funnel.controller";
import { makeNextPage } from "../../platform/NextPage";

export const GhibliFunnelPage = makeNextPage(
  Effect.map(startFunnel("ghibli"), (model) => (
    <ConnectedFunnelView
      model={model}
      submitAction={submitGhibliFunnel}
      universe="ghibli"
    />
  )),
);
