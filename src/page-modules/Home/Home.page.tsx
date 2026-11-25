import { Effect, Function } from "effect";
import { ConnectedHomeView } from "../../components/HomeView.connected";
import { loadHome } from "../../controllers/Home.controller";
import { makeNextPage } from "../../platform/NextPage";

export const HomePage = Function.pipe(
  loadHome,
  Effect.map((model) => <ConnectedHomeView model={model} />),
  makeNextPage,
);
