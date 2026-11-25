import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { luke } from "../domain/FilmUniverse.fixture";
import { catalogOf } from "../services/PeopleCatalog.fixture";
import {
  currentRenderContext,
  runInRenderContext,
} from "./RenderContext";
import { renderContext } from "./RenderContext.fixture";

const context = renderContext(catalogOf([luke]));

describe("RenderContext", () => {
  it("fails when a render has no request context", () => {
    expect(() => currentRenderContext()).toThrow(
      "No request context for this render.",
    );
  });

  it("exposes the request context to the render", async () => {
    const seen = await runInRenderContext(
      context,
      async () => currentRenderContext(),
    );
    expect(seen).toBe(context);
  });

  it("restores the surrounding context after a nested render", async () => {
    const other = renderContext(catalogOf([]));

    const seen = await runInRenderContext(context, async () => {
      await runInRenderContext(other, async () => currentRenderContext());
      return currentRenderContext();
    });

    expect(seen).toBe(context);
  });

  it("rejects with the render's error", async () => {
    await expect(
      runInRenderContext(context, () =>
        Promise.reject(new Error("render failed"))
      ),
    ).rejects.toThrow("render failed");
  });
});
