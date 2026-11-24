import { describe, expect, it } from "vitest";
import { makeFilmListItemViewModel } from "../src/components/FilmListItem/FilmListItem.factory";
import { makeEn } from "../src/i18n/I18n.service";

const i18n = makeEn();

describe("makeFilmListItemViewModel", () => {
  it("formats a film for the list", () => {
    expect(
      makeFilmListItemViewModel(i18n, {
        title: "A New Hope",
        episodeId: 4,
      }),
    ).toEqual({
      _tag: "FilmListItemViewModel",
      text: "A New Hope (Episode 4)",
    });
  });
});
