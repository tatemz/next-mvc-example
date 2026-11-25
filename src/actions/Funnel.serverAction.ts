"use server";

import type { FunnelViewModel } from "../components/Funnel";
import { advanceFunnel } from "../controllers/Funnel.controller";
import { swapiRuntime } from "../server/Runtime";

export async function submitFunnel(
  previous: FunnelViewModel,
  formData: FormData,
) {
  return swapiRuntime.runPromise(advanceFunnel(previous, formData));
}
