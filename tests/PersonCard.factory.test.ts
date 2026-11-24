import { describe, expect, it } from "vitest";
import { makePersonViewModel } from "../src/components/PersonCard/PersonCard.factory";

describe("makePersonViewModel", () => {
  it("builds the card model from the fields it renders", () => {
    expect(
      makePersonViewModel({ name: "Luke Skywalker", height: "172", mass: "77" }),
    ).toEqual({
      _tag: "PersonViewModel",
      name: "Luke Skywalker",
      height: "172",
      mass: "77",
      heightLabel: "Height",
      massLabel: "Mass",
    });
  });
});
