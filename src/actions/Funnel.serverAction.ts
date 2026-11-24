"use server";

import type { FunnelViewModel } from "../components/Funnel/Funnel";
import { advanceFunnel } from "../controllers/Funnel.controller";
import { runtime } from "../server/Runtime";

export async function submitFunnel(
  previous: FunnelViewModel,
  formData: FormData,
) {
  return runtime.runPromise(advanceFunnel(previous, formData));
}
