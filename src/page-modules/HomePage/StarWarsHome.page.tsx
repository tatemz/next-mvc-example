import { Effect } from "effect";
import { searchPerson } from "../../actions/SearchPerson.serverAction";
import { ConnectedHomePage } from "../../components/HomePage.connected";
import { loadHomePage } from "../../controllers/HomePage.controller";
import { makeNextPage } from "../../platform/NextPage";
import { swapiRuntime } from "../../server/Runtime";

export const StarWarsHomePage = makeNextPage(
  swapiRuntime,
  Effect.map(loadHomePage("/star-wars/funnel", "night"), (model) => (
    <ConnectedHomePage model={model} searchAction={searchPerson} />
  )),
);
