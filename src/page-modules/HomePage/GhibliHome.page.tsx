import { Effect } from "effect";
import { ConnectedHomePage } from "../../components/HomePage.connected";
import { loadHomePage } from "../../controllers/HomePage.controller";
import { makeNextPage } from "../../platform/NextPage";
import { shellRuntime } from "../../server/Runtime";
import { ghibliSplashImage } from "./SplashImages";

export const GhibliHomePage = makeNextPage(
  shellRuntime,
  Effect.map(
    loadHomePage(
      "ghibli",
      "/ghibli/funnel",
      "autumn",
      ghibliSplashImage,
    ),
    (model) => <ConnectedHomePage model={model} />,
  ),
);
