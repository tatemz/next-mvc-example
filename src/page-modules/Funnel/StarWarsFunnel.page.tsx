import { submitFunnel } from "../../actions/Funnel.serverAction";
import { swapiRuntime } from "../../server/Runtime";
import { makeFunnelPage } from "./Funnel.factory";

export const StarWarsFunnelPage = makeFunnelPage(swapiRuntime, submitFunnel);
