import { Effect } from "effect";
import { ghibliSplashImage } from "../../components/HomeView";
import { ConnectedHomeView } from "../../components/HomeView.connected";
import { loadHome } from "../../controllers/Home.controller";
import { makeNextPage } from "../../platform/NextPage";

export const GhibliHomePage = makeNextPage(
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
