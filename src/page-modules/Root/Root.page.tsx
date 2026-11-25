import { loadRootPage } from "../../controllers/Root.controller";
import { makeNextPage } from "../../platform/NextPage";

export const RootPage = makeNextPage(loadRootPage);
