import { submitGhibliFunnel } from "../../actions/GhibliFunnel.serverAction";
import { ghibliRuntime } from "../../server/Runtime";
import { makeFunnelPage } from "./Funnel.factory";

export const GhibliFunnelPage = makeFunnelPage(
  ghibliRuntime,
  submitGhibliFunnel,
);
