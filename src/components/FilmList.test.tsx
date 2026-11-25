import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { makeEn } from "../i18n/I18n.service";
import {
  FilmListItemViewModel,
  makeFilmListItemViewModel,
} from "./FilmListItem";
import {
  FilmList,
  FilmListViewModel,
  makeFilmListViewModel,
} from "./FilmList";

const i18n = makeEn();

describe("makeFilmListViewModel", () => {
  it("labels a single film", () => {
    const model = makeFilmListViewModel(i18n, [
      makeFilmListItemViewModel({
        title: "A New Hope",
        order: 4,
      }),
    ]);

    expect(model.countLabel).toBe("1 film");
    expect(model.films).toEqual([
      {
        _tag: "FilmListItemViewModel",
        order: 4,
        text: "A New Hope",
      },
    ]);
  });

  it("pluralizes the count", () => {
    const model = makeFilmListViewModel(i18n, [
      makeFilmListItemViewModel({
        title: "A New Hope",
        order: 4,
      }),
      makeFilmListItemViewModel({
        title: "The Empire Strikes Back",
        order: 5,
      }),
    ]);

    expect(model.countLabel).toBe("2 films");
    expect(model.films).toEqual([
      {
        _tag: "FilmListItemViewModel",
        order: 4,
        text: "A New Hope",
      },
      {
        _tag: "FilmListItemViewModel",
        order: 5,
        text: "The Empire Strikes Back",
      },
    ]);
  });
});

describe("FilmList", () => {
  it("renders the film text from the model", () => {
    const html = renderToStaticMarkup(
      <FilmList
        {...FilmListViewModel.make({
          countLabel: "1 film",
          films: [
            FilmListItemViewModel.make({
              order: 4,
              text: "A New Hope (Part 4)",
            }),
          ],
        })}
      />,
    );

    expect(html).toContain("A New Hope (Part 4)");
  });
});
