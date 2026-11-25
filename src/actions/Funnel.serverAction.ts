"use server";

import { Effect } from "effect";
import type { FunnelViewModel } from "../components/FunnelView";
import { advanceFunnel } from "../controllers/Funnel.controller";
import { I18nCatalog } from "../i18n/I18n.service";
import { Catalogs } from "../services/Catalogs";
import { currentRenderContext } from "../server/RenderContext";

export async function submitFunnel(
  previous: FunnelViewModel,
  formData: FormData,
) {
  return Effect.runPromiseWith(currentRenderContext())(
    Effect.gen(function*() {
      const catalogs = yield* Catalogs;
      const i18ns = yield* I18nCatalog;
      const { locale, universe } = previous.shell;

      return yield* advanceFunnel(
        {
          universe,
          catalog: catalogs[universe],
          i18n: i18ns[locale],
        },
        previous,
        formData,
      );
    }),
  );
}
