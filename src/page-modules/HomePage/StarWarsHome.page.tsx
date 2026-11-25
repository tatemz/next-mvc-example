import { Effect } from "effect";
import { ConnectedHomePage } from "../../components/HomePage.connected";
import { loadHomePage } from "../../controllers/HomePage.controller";
import { makeNextPage } from "../../platform/NextPage";
import { shellRuntime } from "../../server/Runtime";
import { starWarsSplashImage } from "./SplashImages";

export const StarWarsHomePage = makeNextPage(
  shellRuntime,
  Effect.map(
    loadHomePage(
      "star-wars",
      "/star-wars/funnel",
      "night",
      starWarsSplashImage,
    ),
    (model) => <ConnectedHomePage model={model} />,
  ),
);
