import type { Config, ManagedRuntime } from "effect";
import {
  ConnectedFunnel,
  type FunnelAction,
} from "../../components/Funnel/Funnel.connected";
import { startFunnel } from "../../controllers/Funnel.controller";
import type { I18n } from "../../i18n/I18n.service";
import type { PeopleCatalog } from "../../services/PeopleCatalog";

export type FunnelRuntime = ManagedRuntime.ManagedRuntime<
  I18n | PeopleCatalog,
  Config.ConfigError
>;

export const makeFunnelPage = (
  runtime: FunnelRuntime,
  submitAction: FunnelAction,
) =>
  async function FunnelPage() {
    const model = await runtime.runPromise(startFunnel);
    return <ConnectedFunnel model={model} submitAction={submitAction} />;
  };
