import { describe, expect, it } from "vitest";
import { makeFilmListItemViewModel } from "../src/components/FilmListItem/FilmListItem.factory";

describe("makeFilmListItemViewModel", () => {
  it("formats a film for the list", () => {
    expect(
      makeFilmListItemViewModel({ title: "A New Hope", episodeId: 4 }),
    ).toEqual({
      _tag: "FilmListItemViewModel",
      text: "A New Hope (Episode 4)",
    });
  });
});
