import { Effect, Function, Match } from "effect";
import { ConnectedHomeView } from "../../components/HomeView.connected";
import { NotFoundView } from "../../components/NotFoundView";
import { loadHome } from "../../controllers/Home.controller";
import { makeNextPage } from "../../platform/NextPage";
import { withUniverseServices } from "../withUniverseServices";

export const HomePage = Function.pipe(
  withUniverseServices((services) => Effect.succeed(loadHome(services))),
  Effect.map((model) =>
    Match.valueTags(model, {
      NotFoundViewModel: (notFound) => <NotFoundView model={notFound} />,
      HomeViewModel: (home) => <ConnectedHomeView model={home} />,
    })
  ),
  makeNextPage,
);
