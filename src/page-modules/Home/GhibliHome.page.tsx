import { Effect } from "effect";
import { ConnectedHomeView } from "../../components/HomeView.connected";
import { loadHome } from "../../controllers/Home.controller";
import { makeNextPage } from "../../platform/NextPage";

export const GhibliHomePage = makeNextPage(
  Effect.map(
    loadHome("ghibli"),
    (model) => <ConnectedHomeView model={model} universe="ghibli" />,
  ),
);
