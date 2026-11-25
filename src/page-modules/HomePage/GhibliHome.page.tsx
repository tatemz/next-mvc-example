import { Effect } from "effect";
import { ghibliSplashImage } from "../../components/HomePage";
import { ConnectedHomePage } from "../../components/HomePage.connected";
import { loadHomePage } from "../../controllers/HomePage.controller";
import { makeNextPage } from "../../platform/NextPage";
import { shellRuntime } from "../../server/Runtime";

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
