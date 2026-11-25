import { Effect } from "effect";
import { searchGhibliPerson } from "../../actions/GhibliSearchPerson.serverAction";
import { ConnectedHomePage } from "../../components/HomePage.connected";
import { loadHomePage } from "../../controllers/HomePage.controller";
import { makeNextPage } from "../../platform/NextPage";
import { ghibliRuntime } from "../../server/Runtime";

export const GhibliHomePage = makeNextPage(
  ghibliRuntime,
  Effect.map(loadHomePage("/ghibli/funnel", "autumn"), (model) => (
    <ConnectedHomePage
      model={model}
      searchAction={searchGhibliPerson}
      universe="ghibli"
    />
  )),
);
