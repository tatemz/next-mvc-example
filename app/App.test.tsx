import { it } from "@effect/vitest";
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

  it("keeps the root layout to html and body", () => {
    const html = renderToStaticMarkup(
      RootLayout({ children: <p>child</p> }),
    );

    expect(html).toContain('<html lang="en">');
    expect(html).toContain("<body>");
    expect(html).toContain("<p>child</p>");
    expect(html).not.toContain("Character Dossier");
  });
});
