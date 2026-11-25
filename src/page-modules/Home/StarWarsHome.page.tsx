import { Effect } from "effect";
import { starWarsSplashImage } from "../../components/HomeView";
import { ConnectedHomeView } from "../../components/HomeView.connected";
import { loadHome } from "../../controllers/Home.controller";
import { makeNextPage } from "../../platform/NextPage";
import { shellRuntime } from "../../server/Runtime";

export const StarWarsHomePage = makeNextPage(
  shellRuntime,
  Effect.map(
    loadHome(
      "star-wars",
      "/star-wars/funnel",
      "night",
      starWarsSplashImage,
    ),
    (model) => <ConnectedHomeView model={model} universe="star-wars" />,
  ),
);
