import { Effect } from "effect";
import { ConnectedHomeView } from "../../components/HomeView.connected";
import { loadHome } from "../../controllers/Home.controller";
import { makeNextPage } from "../../platform/NextPage";

export const StarWarsHomePage = makeNextPage(
  Effect.map(
    loadHome("star-wars"),
    (model) => <ConnectedHomeView model={model} universe="star-wars" />,
  ),
);
