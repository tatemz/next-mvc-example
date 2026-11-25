import { it } from "@effect/vitest";
import { Effect, Layer, ManagedRuntime } from "effect";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, vi } from "vitest";

vi.mock("../src/server/Runtime", async () => {
  const { Effect, Layer, ManagedRuntime } = await import("effect");
  const { layer: i18nLayer } = await import("../src/i18n/I18n.service");
  const { layerStub } = await import("../src/services/SwapiPeopleCatalog.layer");
  const { luke } = await import("../src/domain/FilmUniverse.fixture");
  const catalogRuntime = ManagedRuntime.make(
    Layer.mergeAll(
      i18nLayer,
      layerStub(() => Effect.succeed(luke)),
    ),
  );

  return {
    shellRuntime: ManagedRuntime.make(i18nLayer),
    swapiRuntime: catalogRuntime,
    ghibliRuntime: catalogRuntime,
  };
});

import GhibliPage from "./ghibli/page";
import RootLayout from "./layout";
import StarWarsPage from "./star-wars/page";

describe("app", () => {
  it("exposes each dataset page", () => {
    expect(typeof StarWarsPage).toBe("function");
    expect(typeof GhibliPage).toBe("function");
  });

  it.effect("wraps children in the shared app shell", () =>
    Effect.gen(function*() {
      const element = yield* Effect.promise(() =>
        RootLayout({ children: <p>child</p> }),
      );
      const html = renderToStaticMarkup(element);

      expect(html).toContain('<html lang="en" data-theme="night">');
      expect(html).toContain("Character Dossier");
      expect(html).toContain('href="/star-wars"');
      expect(html).toContain('href="/ghibli"');
      expect(html).toContain("<p>child</p>");
    }),
  );
});
