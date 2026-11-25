import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect, vi } from "vitest";
import { presentLoadedHomePage } from "../controllers/HomePage.controller";
import { makeEn } from "../i18n/I18n.service";
import { makeAppShellViewModel } from "../components/AppShell";
import { luke } from "../domain/FilmUniverse.fixture";

vi.mock("../server/Runtime", async () => {
  const { Effect, Layer, ManagedRuntime } = await import("effect");
  const { layer: i18nLayer } = await import("../i18n/I18n.service");
  const { layerStub } = await import("../services/SwapiPeopleCatalog.layer");
  const { personNamed } = await import("../domain/FilmUniverse.fixture");

  const runtime = ManagedRuntime.make(
    Layer.mergeAll(
      i18nLayer,
      layerStub((id) => Effect.succeed(personNamed(id, "Runtime"))),
    ),
  );

  return { swapiRuntime: runtime };
});

import { searchPerson } from "./SearchPerson.serverAction";

describe("searchPerson server action", () => {
  it.effect("runs the controller effect through the runtime", () =>
    Effect.gen(function*() {
      const previous = presentLoadedHomePage(
        makeEn(),
        luke,
        "/star-wars/funnel",
        makeAppShellViewModel(makeEn(), "night"),
      );
      const formData = new FormData();
      formData.set("characterId", "3");

      const result = yield* Effect.promise(() =>
        searchPerson(previous, formData),
      );

      expect(result).toMatchObject({
        _tag: "Loaded",
        form: { value: "3" },
        person: { name: "Runtime" },
      });
    }),
  );
});
