import { describe, expect, it } from "vitest";
import { makeFilmListViewModel } from "../src/components/FilmList/FilmList.factory";

describe("makeFilmListViewModel", () => {
  it("labels a single film", () => {
    const model = makeFilmListViewModel([
      { title: "A New Hope", episodeId: 4 },
    ]);

    expect(model.countLabel).toBe("1 film");
  });

  it("pluralizes the count", () => {
    const model = makeFilmListViewModel([
      { title: "A New Hope", episodeId: 4 },
      { title: "The Empire Strikes Back", episodeId: 5 },
    ]);

    expect(model.countLabel).toBe("2 films");
  });
});
