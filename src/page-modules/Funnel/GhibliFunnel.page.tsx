import { Effect } from "effect";
import { submitGhibliFunnel } from "../../actions/GhibliFunnel.serverAction";
import { ConnectedFunnel } from "../../components/Funnel.connected";
import { startFunnel } from "../../controllers/Funnel.controller";
import { makeNextPage } from "../../platform/NextPage";
import { ghibliRuntime } from "../../server/Runtime";

export const GhibliFunnelPage = makeNextPage(
  ghibliRuntime,
  Effect.map(startFunnel("autumn"), (model) => (
    <ConnectedFunnel
      model={model}
      submitAction={submitGhibliFunnel}
      universe="ghibli"
    />
  )),
);
