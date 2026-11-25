import { Effect, Function } from "effect";
import { submitGhibliFunnel } from "../../actions/GhibliFunnel.serverAction";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import { startFunnel } from "../../controllers/Funnel.controller";
import { makeNextPage } from "../../platform/NextPage";

export const GhibliFunnelPage = Function.pipe(
  startFunnel("ghibli"),
  Effect.map((model) => (
    <ConnectedFunnelView
      model={model}
      submitAction={submitGhibliFunnel}
      universe="ghibli"
    />
  )),
  makeNextPage,
);
