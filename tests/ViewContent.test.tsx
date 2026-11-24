import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FilmListViewModel } from "../src/components/FilmList/FilmList.model";
import { FilmList } from "../src/components/FilmList/FilmList.view";
import { FilmListItemViewModel } from "../src/components/FilmListItem/FilmListItem.model";
import { PersonViewModel } from "../src/components/PersonCard/PersonCard.model";
import { PersonCard } from "../src/components/PersonCard/PersonCard.view";
import { SearchFormViewModel } from "../src/components/SearchForm/SearchForm.model";
import { SearchForm } from "../src/components/SearchForm/SearchForm.view";

describe("view content", () => {
  it("renders search form copy from the model", () => {
    const model = SearchFormViewModel.make({
      characterId: "1",
      label: "Sith id",
      submitLabel: "Find them",
      pendingLabel: "Searching...",
    });

    const idle = renderToStaticMarkup(
      <SearchForm model={model} dispatch={() => {}} isPending={false} />,
    );
    expect(idle).toContain("Sith id");
    expect(idle).toContain("Find them");

    const pending = renderToStaticMarkup(
      <SearchForm model={model} dispatch={() => {}} isPending={true} />,
    );
    expect(pending).toContain("Searching...");
    expect(pending).not.toContain("Find them");
  });

  it("renders person labels from the model", () => {
    const html = renderToStaticMarkup(
      <PersonCard
        model={PersonViewModel.make({
          name: "Luke Skywalker",
          height: "172",
          mass: "77",
          heightLabel: "Tallness",
          massLabel: "Heft",
        })}
      />,
    );

    expect(html).toContain("Tallness");
    expect(html).toContain("Heft");
  });

  it("renders the film text from the model", () => {
    const html = renderToStaticMarkup(
      <FilmList
        model={FilmListViewModel.make({
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
