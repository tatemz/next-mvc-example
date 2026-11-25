import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import * as I18n from "./I18n";
import { I18nCatalog, layer, layerTest } from "./I18n.service";
import { Locales } from "./Locale";

describe("I18n.make", () => {
  it("formats a message with values", () => {
    const i18n = I18n.make({
      messages: { greeting: "Hello, {name}!" } as const,
      locale: "en-US",
    });

    expect(i18n._({ id: "greeting", values: { name: "John" } })).toBe(
      "Hello, John!",
    );
  });

  it("formats all descriptors", () => {
    const i18n = I18n.make({ messages: { a: "A", b: "B" } as const, locale: "en-US" });

    expect(i18n.all([{ id: "a" }, { id: "b" }])).toEqual({ a: "A", b: "B" });
  });

  it("formats a plural message", () => {
    const i18n = I18n.make({
      messages: {
        items: "{count, plural, one {# item} other {# items}}",
      } as const,
      locale: "en-US",
    });

    expect(i18n._({ id: "items", values: { count: 1 } })).toBe("1 item");
    expect(i18n._({ id: "items", values: { count: 3 } })).toBe("3 items");
  });
});

describe("I18n.service", () => {
  it.layer(layer)("catalogs", (it) => {
    it.effect("formats each locale's messages", () =>
      Effect.gen(function*() {
        const catalogs = yield* I18nCatalog;
        const en = catalogs[Locales.EnUS];
        const es = catalogs[Locales.EsMX];

        expect(en._({ id: "person.heightLabel" })).toBe("Height");
        expect(en._({ id: "home.starWars.title" })).toBe(
          "Star Wars character dossier",
        );
        expect(es._({ id: "person.heightLabel" })).toBe("Altura");
        expect(es._({ id: "home.starWars.title" })).toBe(
          "Dossier de personaje de Star Wars",
        );
        expect(
          es._({
            id: "funnel.step.progress",
            values: { step: 2, total: 4 },
          }),
        ).toBe("Paso 2 de 4");
        expect(
          es._({
            id: "funnel.choose.subtitle",
            values: { count: 2 },
          }),
        ).toContain("2 personajes coinciden");
        expect(es.locale).toBe(Locales.EsMX);
      }),
    );
  });

  it.layer(layerTest)("test", (it) => {
    it.effect("formats descriptors for assertions", () =>
      Effect.gen(function*() {
        const i18n = (yield* I18nCatalog)[Locales.EnUS];

        expect(i18n._({ id: "person.heightLabel" })).toBe(
          '{"id":"person.heightLabel"}',
        );
        expect(i18n.all([{ id: "person.heightLabel" }])).toEqual({
          "person.heightLabel": '{"id":"person.heightLabel"}',
        });
      }),
    );
  });
});
