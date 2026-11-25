import { loadRootPage } from "../../controllers/Root.controller";
import { makeRedirectNextPage } from "../../platform/NextPage";

export const RootPage = makeRedirectNextPage(loadRootPage);
