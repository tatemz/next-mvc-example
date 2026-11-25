import { Layer, ManagedRuntime } from "effect";
import { loadRootPage } from "../../controllers/Root.controller";
import { makeNextPage } from "../../platform/NextPage";

const runtime = ManagedRuntime.make(Layer.empty);

export const RootPage = makeNextPage(runtime, loadRootPage);
