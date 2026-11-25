import { Effect, Function, Match } from "effect";
import { submitFunnel } from "../../actions/Funnel.serverAction";
import type { FunnelViewModel } from "../../components/FunnelView";
import { ConnectedFunnelView } from "../../components/FunnelView.connected";
import {
  NotFoundView,
  type NotFoundViewModel,
} from "../../components/NotFoundView";
import { startFunnel } from "../../controllers/Funnel.controller";
import { makeNextPage } from "../../platform/NextPage";
import { withUniverseServices } from "../withUniverseServices";

const funnelView = (model: FunnelViewModel) => (
  <ConnectedFunnelView model={model} submitAction={submitFunnel} />
);

export const FunnelPage = Function.pipe(
  withUniverseServices((services) => Effect.succeed(startFunnel(services))),
  Effect.map((model: FunnelViewModel | NotFoundViewModel) =>
    Match.valueTags(model, {
      NotFoundViewModel: (notFound) => <NotFoundView model={notFound} />,
      Search: funnelView,
      Choose: funnelView,
      Film: funnelView,
      Transport: funnelView,
      Review: funnelView,
      Failed: funnelView,
    }),
  ),
  makeNextPage,
);
