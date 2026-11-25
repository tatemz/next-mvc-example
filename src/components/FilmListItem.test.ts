import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import {
  FilmListItem,
  FilmListItemViewModel,
  makeFilmListItemViewModel,
} from "./FilmListItem";

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

describe("FilmListItem", () => {
  it("renders a poster when the film has one", () => {
    const html = renderToStaticMarkup(
      FilmListItem(
        FilmListItemViewModel.make({
          order: 4,
          text: "A New Hope",
          imageUrl: "https://example.com/poster.jpg",
        }),
      ),
    );

    expect(html).toContain("poster.jpg");
  });

  it("renders no poster when the film has none", () => {
    const html = renderToStaticMarkup(
      FilmListItem(
        FilmListItemViewModel.make({
          order: 4,
          text: "A New Hope",
        }),
      ),
    );

    expect(html).not.toContain("<img");
  });
});
