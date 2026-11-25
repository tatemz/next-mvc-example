import { RedirectTypes } from "../../platform/NextRedirect";
import { it } from "@effect/vitest";
import { describe, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string, type?: string) => {
    throw new Error(`NEXT_REDIRECT;${type};${url}`);
  }),
}));

import { redirect } from "next/navigation";
import { runInRenderContext } from "../../server/RenderContext";
import { renderContext } from "../../server/RenderContext.fixture";
import { unusedCatalog } from "../../services/PeopleCatalog.fixture";
import { RootPage } from "./Root.page";

describe("RootPage", () => {
  it("sends the root to the Star Wars home", async () => {
    await expect(
      runInRenderContext(
        renderContext(unusedCatalog),
        () => RootPage({ searchParams: Promise.resolve({}) }),
      ),
    ).rejects.toThrow("NEXT_REDIRECT;replace;/star-wars");
    expect(redirect).toHaveBeenCalledWith("/star-wars", RedirectTypes.Replace);
  });
});
