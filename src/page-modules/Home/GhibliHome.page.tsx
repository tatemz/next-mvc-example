import { Effect } from "effect";
import { ghibliSplashImage } from "../../components/HomeView";
import { ConnectedHomeView } from "../../components/HomeView.connected";
import { loadHome } from "../../controllers/Home.controller";
import { makeNextPage } from "../../platform/NextPage";
import { shellRuntime } from "../../server/Runtime";

export const GhibliHomePage = makeNextPage(
  shellRuntime,
  Effect.map(
    loadHome(
      "ghibli",
      "/ghibli/funnel",
      "autumn",
      ghibliSplashImage,
    ),
    (model) => <ConnectedHomeView model={model} universe="ghibli" />,
  ),
);
