import type { Effect } from "effect";
import {
  ConnectedHomePage,
  type HomePageAction,
} from "../../components/HomePage/HomePage.connected";
import { setHeroFunnelHref } from "../../components/HomePage/HomePage";
import { loadHomePage } from "../../controllers/HomePage.controller";
import type { I18n } from "../../i18n/I18n.service";
import type { PeopleCatalog } from "../../services/PeopleCatalog";

export type HomePageRuntime = {
  readonly runPromise: <A, E>(
    effect: Effect.Effect<A, E, I18n | PeopleCatalog>,
  ) => Promise<A>;
};

export const makeHomePage = (
  runtime: HomePageRuntime,
  searchAction: HomePageAction,
  funnelHref: string,
) =>
  async function HomePage() {
    const model = await runtime.runPromise(loadHomePage);
    return (
      <ConnectedHomePage
        model={setHeroFunnelHref(model, funnelHref)}
        searchAction={searchAction}
      />
    );
  };
