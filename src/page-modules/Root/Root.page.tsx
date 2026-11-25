import { loadRootPage } from "../../controllers/Root.controller";
import { makeNextPage } from "../../platform/NextPage";
import { shellRuntime } from "../../server/Runtime";

export const RootPage = makeNextPage(shellRuntime, loadRootPage);
