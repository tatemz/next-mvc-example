import { Schema } from "effect";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  makeFailedHomePageModel,
  makeLoadedHomePageModel,
} from "../src/components/HomePage/factory";
import { HomePageViewModel } from "../src/components/HomePage/model";
import { HomePage } from "../src/components/HomePage/view";
import { luke } from "./fixtures/person";

describe("makeLoadedHomePageModel", () => {
  it("turns a domain person into a loaded view model", () => {
    const model = makeLoadedHomePageModel(luke);

    expect(model).toMatchObject({
      _tag: "Loaded",
      form: { _tag: "SearchFormViewModel", characterId: "1" },
      person: {
        _tag: "PersonViewModel",
        name: "Luke Skywalker",
        height: "172",
        mass: "77",
      },
      filmList: {
        _tag: "FilmListViewModel",
        films: [
          { _tag: "FilmViewModel", title: "A New Hope", episodeId: 4 },
          {
            _tag: "FilmViewModel",
            title: "The Empire Strikes Back",
            episodeId: 5,
          },
        ],
      },
    });
  });

  it("keeps films a non-empty array in the schema", () => {
    const invalid = {
      _tag: "Loaded",
      form: { _tag: "SearchFormViewModel", characterId: "1" },
      person: {
        _tag: "PersonViewModel",
        name: "Luke Skywalker",
        height: "172",
        mass: "77",
      },
      filmList: { _tag: "FilmListViewModel", films: [] },
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
        model={makeLoadedHomePageModel(luke)}
        dispatch={() => {}}
        isPending={false}
      />,
    );

    expect(html).toContain("<h1>Luke Skywalker</h1>");
    expect(html.match(/<li>/g)).toHaveLength(2);
    expect(html).toContain("A New Hope (Episode 4)");
    expect(html).toContain('value="1"');
  });

  it("renders a failure with the submitted form value", () => {
    const html = renderToStaticMarkup(
      <HomePage
        model={makeFailedHomePageModel({
          characterId: "abc",
          message: "Character id must be a positive whole number.",
        })}
        dispatch={() => {}}
        isPending={false}
      />,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("Character id must be a positive whole number.");
    expect(html).toContain('value="abc"');
  });
});
