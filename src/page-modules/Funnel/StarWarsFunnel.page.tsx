import { Effect } from "effect";
import { submitStarWarsFunnel } from "../../actions/StarWarsFunnel.serverAction";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import { startFunnel } from "../../controllers/Funnel.controller";
import { makeNextPage } from "../../platform/NextPage";

export const StarWarsFunnelPage = makeNextPage(
  Effect.map(startFunnel("star-wars"), (model) => (
    <ConnectedFunnelView
      model={model}
      submitAction={submitStarWarsFunnel}
      universe="star-wars"
    />
  )),
);
