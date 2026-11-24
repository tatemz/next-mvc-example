import { Schema } from "effect";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { makeFailedHomePageModel } from "../src/components/HomePage/HomePage.factory";
import { HomePageViewModel } from "../src/components/HomePage/HomePage.model";
import { presentLoadedHomePage } from "../src/components/HomePage/HomePage.presenter";
import { HomePage } from "../src/components/HomePage/HomePage.view";
import { luke } from "./fixtures/Person.fixture";

describe("presentLoadedHomePage", () => {
  it("presents a domain person as a loaded view model", () => {
    const model = presentLoadedHomePage(luke);

    expect(model).toMatchObject({
      _tag: "Loaded",
      form: {
        _tag: "SearchFormViewModel",
        characterId: "1",
        submitLabel: "Load character",
      },
      person: {
        _tag: "PersonViewModel",
        name: "Luke Skywalker",
        height: "172",
        mass: "77",
        heightLabel: "Height",
        massLabel: "Mass",
      },
      filmList: {
        _tag: "FilmListViewModel",
        countLabel: "2 films",
        films: [
          { _tag: "FilmListItemViewModel", text: "A New Hope (Episode 4)" },
          {
            _tag: "FilmListItemViewModel",
            text: "The Empire Strikes Back (Episode 5)",
          },
        ],
      },
    });
  });
});

describe("HomePageViewModel", () => {
  it("keeps films a non-empty array in the schema", () => {
    const invalid = {
      _tag: "Loaded",
      form: {
        _tag: "SearchFormViewModel",
        characterId: "1",
        label: "Character id",
        submitLabel: "Load character",
        pendingLabel: "Loading...",
      },
      person: {
        _tag: "PersonViewModel",
        name: "Luke Skywalker",
        height: "172",
        mass: "77",
        heightLabel: "Height",
        massLabel: "Mass",
      },
      filmList: {
        _tag: "FilmListViewModel",
        films: [],
        countLabel: "0 films",
      },
    };

    expect(() =>
      Schema.decodeUnknownSync(HomePageViewModel)(invalid),
    ).toThrow();
  });
});

describe("HomePage", () => {
  it("renders the loaded character and films", () => {
    const html = renderToStaticMarkup(
      <HomePage
        model={presentLoadedHomePage(luke)}
        dispatch={() => {}}
        isPending={false}
      />,
    );

    expect(html).toContain("<h1>Luke Skywalker</h1>");
    expect(html.match(/<li>/g)).toHaveLength(2);
    expect(html).toContain("A New Hope (Episode 4)");
    expect(html).toContain("2 films");
    expect(html).toContain("Load character");
    expect(html).toContain('value="1"');
  });

  it("renders a failure with the submitted form value", () => {
    const model = makeFailedHomePageModel({
      characterId: "abc",
      message: "Character id must be a positive whole number.",
    });
    expect(model).toMatchObject({
      form: { _tag: "SearchFormViewModel", submitLabel: "Try again" },
    });

    const html = renderToStaticMarkup(
      <HomePage model={model} dispatch={() => {}} isPending={false} />,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("Character id must be a positive whole number.");
    expect(html).toContain("Try again");
    expect(html).toContain('value="abc"');
  });

  it("renders the pending form state", () => {
    const html = renderToStaticMarkup(
      <HomePage
        model={presentLoadedHomePage(luke)}
        dispatch={() => {}}
        isPending={true}
      />,
    );

    expect(html).toContain("Loading...");
    expect(html).toContain("disabled");
  });
});
