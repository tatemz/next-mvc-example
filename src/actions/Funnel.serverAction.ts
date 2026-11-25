"use server";

import { Effect } from "effect";
import type { FunnelViewModel } from "../components/FunnelView";
import { advanceFunnel } from "../controllers/Funnel.controller";
import { withUniverseFor } from "../page-modules/withUniverseServices";
import { currentRenderContext } from "../server/RenderContext";

export async function submitFunnel(
  previous: FunnelViewModel,
  formData: FormData,
) {
  return Effect.runPromiseWith(currentRenderContext())(
    withUniverseFor(previous.shell.universe)((services) =>
      advanceFunnel(services, previous, formData)
    ),
  );
}
