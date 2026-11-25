"use server";

import type { FunnelViewModel } from "../components/FunnelView";
import { advanceFunnel } from "../controllers/Funnel.controller";
import { swapiRuntime } from "../server/Runtime";

export async function submitStarWarsFunnel(
  previous: FunnelViewModel,
  formData: FormData,
) {
  return swapiRuntime.runPromise(advanceFunnel(previous, formData));
}
