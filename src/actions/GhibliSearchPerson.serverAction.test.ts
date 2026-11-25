import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect, vi } from "vitest";

vi.mock("../server/Runtime", async () => {
  const { Effect, Layer, ManagedRuntime } = await import("effect");
  const { layer: i18nLayer } = await import("../i18n/I18n.service");
  const { layerStub } = await import("../services/SwapiPeopleCatalog.layer");
  const { makeCharacterId, personNamed } = await import(
    "../domain/FilmUniverse.fixture"
  );

  const runtime = ManagedRuntime.make(
    Layer.mergeAll(
      i18nLayer,
      layerStub((id) =>
        Effect.succeed(personNamed(id, `Character ${makeCharacterId("1")}`)),
      ),
    ),
  );

  return { ghibliRuntime: runtime };
});

import { presentLoadedHomePage } from "../controllers/HomePage.controller";
import { luke } from "../domain/FilmUniverse.fixture";
import { makeEn } from "../i18n/I18n.service";
import { makeAppShellViewModel } from "../components/AppShell";
import { searchGhibliPerson } from "./GhibliSearchPerson.serverAction";

describe("searchGhibliPerson server action", () => {
  it.effect("runs the shared search controller through the Ghibli runtime", () =>
    Effect.gen(function*() {
      const previous = presentLoadedHomePage(
        makeEn(),
        luke,
        "/star-wars/funnel",
        makeAppShellViewModel(makeEn(), "night"),
      );
      const formData = new FormData();
      formData.set("characterId", "1");

      const result = yield* Effect.promise(() =>
        searchGhibliPerson(previous, formData),
      );

      expect(result).toMatchObject({
        _tag: "Loaded",
        form: { value: "1" },
        person: { name: "Character 1" },
      });
    }),
  );
});
