import { Effect, Function } from "effect";
import { submitStarWarsFunnel } from "../../actions/StarWarsFunnel.serverAction";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import { startFunnel } from "../../controllers/Funnel.controller";
import { makeNextPage } from "../../platform/NextPage";

export const StarWarsFunnelPage = Function.pipe(
  startFunnel("star-wars"),
  Effect.map((model) => (
    <ConnectedFunnelView
      model={model}
      submitAction={submitStarWarsFunnel}
    />
  )),
  makeNextPage,
);
