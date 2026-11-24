import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { makeEn } from "../../i18n/I18n.service";
import {
  makePersonViewModel,
  PersonCard,
  PersonViewModel,
} from "./PersonCard";

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

describe("PersonCard", () => {
  it("renders person labels from the model", () => {
    const html = renderToStaticMarkup(
      <PersonCard
        {...PersonViewModel.make({
          name: "Luke Skywalker",
          height: "172",
          mass: "77",
          heightLabel: "Tallness",
          massLabel: "Heft",
        })}
      />,
    );

    expect(html).toContain("Tallness");
    expect(html).toContain("Heft");
  });
});
