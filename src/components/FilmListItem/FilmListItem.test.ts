import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { makeFilmListItemViewModel } from "./FilmListItem";

describe("makeFilmListItemViewModel", () => {
  it("formats a film for the list", () => {
    expect(
      makeFilmListItemViewModel({
        title: "A New Hope",
        order: 4,
      }),
    ).toEqual({
      _tag: "FilmListItemViewModel",
      order: 4,
      text: "A New Hope",
    });
  });
});
