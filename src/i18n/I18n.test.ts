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
  it.layer(layer)("en", (it) => {
    it.effect("formats the app messages", () =>
      Effect.gen(function*() {
        const i18n = yield* I18nService;

        expect(i18n._({ id: "person.heightLabel" })).toBe("Height");
        expect(i18n._({ id: "home.starWars.title" })).toBe(
          "Star Wars character dossier",
        );
        expect(
          i18n._({
            id: "funnel.step.progress",
            values: { step: 2, total: 4 },
          }),
        ).toBe("Step 2 of 4");
        expect(
          i18n._({
            id: "funnel.choose.subtitle",
            values: { count: 2 },
          }),
        ).toContain("2 characters matched");
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
      }),
    );
  });
});
