import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { makeFilmListViewModel } from "./FilmList.factory";
import { makeEn } from "../../i18n/I18n.service";

const i18n = makeEn();

describe("makeFilmListViewModel", () => {
  it("labels a single film", () => {
    const model = makeFilmListViewModel(i18n, [
      { title: "A New Hope", episodeId: 4 },
    ]);

    expect(model.countLabel).toBe("1 film");
    expect(model.films).toEqual([
      { _tag: "FilmListItemViewModel", text: "A New Hope (Episode 4)" },
    ]);
  });

  it("pluralizes the count", () => {
    const model = makeFilmListViewModel(i18n, [
      { title: "A New Hope", episodeId: 4 },
      { title: "The Empire Strikes Back", episodeId: 5 },
    ]);

    expect(model.countLabel).toBe("2 films");
    expect(model.films).toEqual([
      { _tag: "FilmListItemViewModel", text: "A New Hope (Episode 4)" },
      {
        _tag: "FilmListItemViewModel",
        text: "The Empire Strikes Back (Episode 5)",
      },
    ]);
  });
});
