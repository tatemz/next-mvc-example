import { Effect, Function } from "effect";
import { submitFunnel } from "../../actions/Funnel.serverAction";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import { startFunnel } from "../../controllers/Funnel.controller";
import { makeNextPage } from "../../platform/NextPage";

export const StarWarsFunnelPage = Function.pipe(
  startFunnel("star-wars"),
  Effect.map((model) => (
    <ConnectedFunnelView
      model={model}
      submitAction={submitFunnel}
    />
  )),
  makeNextPage,
);
