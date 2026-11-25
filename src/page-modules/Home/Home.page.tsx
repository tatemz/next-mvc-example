import { Effect, Function } from "effect";
import { ConnectedHomeView } from "../../components/HomeView.connected";
import { NotFoundView } from "../../components/NotFoundView";
import { loadHome } from "../../controllers/Home.controller";
import { makeNextPage } from "../../platform/NextPage";

export const HomePage = Function.pipe(
  loadHome,
  Effect.map((model) =>
    model._tag === "NotFoundViewModel"
      ? <NotFoundView model={model} />
      : <ConnectedHomeView model={model} />
  ),
  makeNextPage,
);
