import { RedirectTypes } from "../../platform/NextRedirect";
import { it } from "@effect/vitest";
import { describe, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string, type?: string) => {
    throw new Error(`NEXT_REDIRECT;${type};${url}`);
  }),
}));

import { redirect } from "next/navigation";
import { Locales } from "../../i18n/Locale";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { RootPage } from "./Root.page";

const render = (params: Record<string, string>) =>
  runInRenderContext(
    renderContext(),
    () =>
      RootPage({
        params: Promise.resolve(params),
        searchParams: Promise.resolve({}),
      }),
  );

describe("RootPage", () => {
  it("sends the default root to the Star Wars home", async () => {
    await expect(render({})).rejects.toThrow(
      "NEXT_REDIRECT;replace;/star-wars",
    );
    expect(redirect).toHaveBeenCalledWith(
      "/star-wars",
      RedirectTypes.Replace,
    );
  });

  it("sends the Spanish root to the Spanish Star Wars home", async () => {
    await expect(render({ locale: Locales.EsMX })).rejects.toThrow(
      "NEXT_REDIRECT;replace;/es-MX/star-wars",
    );
    expect(redirect).toHaveBeenCalledWith(
      "/es-MX/star-wars",
      RedirectTypes.Replace,
    );
  });
});
