import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { FilmListItemViewModel } from "../FilmListItem/FilmListItem.model";
import { FilmListViewModel } from "./FilmList.model";
import { FilmList } from "./FilmList.view";

describe("FilmList", () => {
  it("renders the film text from the model", () => {
    const html = renderToStaticMarkup(
      <FilmList
        {...FilmListViewModel.make({
          countLabel: "1 film",
          films: [
            FilmListItemViewModel.make({ text: "A New Hope (Part 4)" }),
          ],
        })}
      />,
    );

    expect(html).toContain("A New Hope (Part 4)");
  });
});
