import { ConnectedFunnel } from "../../components/Funnel/Funnel.connected";
import { startFunnel } from "../../controllers/Funnel.controller";
import { swapiRuntime } from "../../server/Runtime";

export async function FunnelPage() {
  const model = await swapiRuntime.runPromise(startFunnel);
  return <ConnectedFunnel {...model} />;
}
