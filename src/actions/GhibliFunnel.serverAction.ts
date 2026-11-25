"use server";

import type { FunnelViewModel } from "../components/Funnel/Funnel";
import { advanceFunnel } from "../controllers/Funnel.controller";
import { ghibliRuntime } from "../server/Runtime";

export async function submitGhibliFunnel(
  previous: FunnelViewModel,
  formData: FormData,
) {
  return ghibliRuntime.runPromise(advanceFunnel(previous, formData));
}
