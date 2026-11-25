"use server";

import { Effect } from "effect";
import type { FunnelViewModel } from "../components/FunnelView";
import { advanceFunnel } from "../controllers/Funnel.controller";
import { currentRenderContext } from "../server/RenderContext";

export async function submitGhibliFunnel(
  previous: FunnelViewModel,
  formData: FormData,
) {
  return Effect.runPromiseWith(currentRenderContext())(
    advanceFunnel(previous, formData),
  );
}
