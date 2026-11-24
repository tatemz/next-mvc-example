import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { makePersonViewModel } from "./PersonCard.factory";
import { makeEn } from "../../i18n/I18n.service";

const i18n = makeEn();

describe("makePersonViewModel", () => {
  it("formats known measurements", () => {
    expect(
      makePersonViewModel(i18n, {
        name: "Luke Skywalker",
        height: "172",
        mass: "77",
      }),
    ).toEqual({
      _tag: "PersonViewModel",
      name: "Luke Skywalker",
      height: "172",
      mass: "77",
      heightLabel: "Height",
      massLabel: "Mass",
    });
  });

  it("replaces unknown measurements with a display value", () => {
    expect(
      makePersonViewModel(i18n, {
        name: "Yoda",
        height: "unknown",
        mass: "",
      }),
    ).toEqual({
      _tag: "PersonViewModel",
      name: "Yoda",
      height: "Unknown",
      mass: "Unknown",
      heightLabel: "Height",
      massLabel: "Mass",
    });
  });
});
