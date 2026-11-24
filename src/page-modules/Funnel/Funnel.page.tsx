import { ConnectedFunnel } from "../../components/Funnel/Funnel.connected";
import { startFunnel } from "../../controllers/Funnel.controller";
import { runtime } from "../../server/Runtime";

export async function FunnelPage() {
  const model = await runtime.runPromise(startFunnel);
  return <ConnectedFunnel {...model} />;
}
