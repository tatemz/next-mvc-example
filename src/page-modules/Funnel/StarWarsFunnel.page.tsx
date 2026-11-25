import { Effect } from "effect";
import { submitStarWarsFunnel } from "../../actions/StarWarsFunnel.serverAction";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import { startFunnel } from "../../controllers/Funnel.controller";
import { makeNextPage } from "../../platform/NextPage";
import { swapiRuntime } from "../../server/Runtime";

export const StarWarsFunnelPage = makeNextPage(
  swapiRuntime,
  Effect.map(startFunnel("night"), (model) => (
    <ConnectedFunnelView
      model={model}
      submitAction={submitStarWarsFunnel}
      universe="star-wars"
    />
  )),
);
