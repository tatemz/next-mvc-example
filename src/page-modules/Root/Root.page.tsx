import { Schema } from "effect";
import { loadRootPage } from "../../controllers/Root.controller";
import { makeNextPage } from "../../platform/NextPage";
import { shellRuntime } from "../../server/Runtime";

export const RootPage = makeNextPage({
  runtime: shellRuntime,
  searchParams: Schema.Struct({}),
  load: () => loadRootPage,
});
