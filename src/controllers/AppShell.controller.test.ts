import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import { I18n, makeEn } from "../i18n/I18n.service";
import { loadAppShell } from "./AppShell.controller";

describe("loadAppShell", () => {
  it.effect("builds the shell view model from i18n and a universe", () =>
    Effect.gen(function*() {
      const model = yield* loadAppShell("ghibli").pipe(
        Effect.provideService(I18n, makeEn()),
      );

      expect(model).toMatchObject({
        theme: "autumn",
        brand: { label: "Character Dossier", href: "/" },
        links: [
          { label: "Star Wars", href: "/star-wars" },
          { label: "Ghibli", href: "/ghibli" },
        ],
      });
    }),
  );
});
