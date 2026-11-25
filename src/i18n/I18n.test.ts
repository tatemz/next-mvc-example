import { it } from "@effect/vitest";
import { Effect } from "effect";
import { describe, expect } from "vitest";
import * as I18n from "./I18n";
import {
  I18n as I18nService,
  layer,
  layerTest,
} from "./I18n.service";

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

  it("formats a rich message", () => {
    const i18n = I18n.make({ messages: { greeting: "Hello" } as const, locale: "en-US" });

    expect(i18n.rich({ id: "greeting" })).toBe("Hello");
  });
});

describe("I18n.service", () => {
  it.layer(layer)("en", (it) => {
    it.effect("formats the app messages", () =>
      Effect.gen(function*() {
        const i18n = yield* I18nService;

        expect(i18n._({ id: "person.heightLabel" })).toBe("Height");
        expect(i18n._({ id: "homePage.starWars.title" })).toBe(
          "Star Wars character dossier",
        );
      }),
    );
  });

  it.layer(layerTest)("test", (it) => {
    it.effect("formats descriptors for assertions", () =>
      Effect.gen(function*() {
        const i18n = yield* I18nService;

        expect(i18n._({ id: "person.heightLabel" })).toBe(
          '{"id":"person.heightLabel"}',
        );
        expect(i18n.all([{ id: "person.heightLabel" }])).toEqual({
          "person.heightLabel": '{"id":"person.heightLabel"}',
        });
        expect(i18n.rich({ id: "person.heightLabel" })).toEqual([
          '{"id":"person.heightLabel"}',
        ]);
      }),
    );
  });
});
