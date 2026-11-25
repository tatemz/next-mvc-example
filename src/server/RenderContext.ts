import { AsyncLocalStorage } from "node:async_hooks";
import type { Context } from "effect";
import type { I18n } from "../i18n/I18n.service";
import type { PeopleCatalog } from "../services/PeopleCatalog";

export type RenderServices = I18n | PeopleCatalog;

declare global {
  var __renderContextStore: AsyncLocalStorage<Context.Context<never>> | undefined;
}

const store = (globalThis.__renderContextStore ??=
  new AsyncLocalStorage<Context.Context<never>>());

export const currentRenderContext = (): Context.Context<RenderServices> => {
  const context = store.getStore();
  if (context === undefined) {
    throw new Error(
      "No request context for this render. Pages must render through runInRenderContext.",
    );
  }
  return context as Context.Context<RenderServices>;
};

export const runInRenderContext = <A>(
  context: Context.Context<never>,
  render: () => Promise<A>,
): Promise<A> =>
  new Promise<A>((resolve, reject) => {
    store.run(context, () => {
      render().then(resolve, reject);
    });
  });
