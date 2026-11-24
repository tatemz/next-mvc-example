import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { makeFilmListItemViewModel } from "./FilmListItem.factory";
import { makeEn } from "../../i18n/I18n.service";

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
