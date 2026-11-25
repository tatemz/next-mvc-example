import { Context } from "effect";
import { I18n, makeEn } from "../i18n/I18n.service";
import { PeopleCatalog } from "../services/PeopleCatalog";
import type { RenderServices } from "./RenderContext";

export const renderContext = (
  catalog: PeopleCatalog,
): Context.Context<RenderServices> =>
  Context.make(I18n, makeEn()).pipe(Context.add(PeopleCatalog, catalog));
