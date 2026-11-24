import { Schema } from "effect";
import { renderToStaticMarkup } from "react-dom/server";
import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { presentLoadedHomePage } from "../../controllers/HomePage.controller";
import { luke } from "../../domain/StarWars.fixture";
import { makeEn } from "../../i18n/I18n.service";
import {
  HomePage,
  HomePageOptics,
  HomePageViewModel,
  makeFailedHomePageModel,
} from "./HomePage";
import { ConnectedHomePage } from "./HomePage.connected";

const i18n = makeEn();

describe("presentLoadedHomePage", () => {
  it("presents a domain person as a loaded view model", () => {
    const model = presentLoadedHomePage(i18n, luke);

    expect(model).toMatchObject({
      _tag: "Loaded",
      hero: {
        _tag: "HomeHeroViewModel",
        funnelHref: "/funnel",
      },
      form: {
        _tag: "SearchFormViewModel",
        value: "1",
        submitLabel: "Load character",
      },
      person: {
        _tag: "PersonViewModel",
        name: "Luke Skywalker",
        height: "172",
        mass: "77",
        birthYear: "19BBY",
        gender: "male",
        heightLabel: "Height",
        massLabel: "Mass",
        homeworld: { _tag: "PlanetViewModel", name: "Tatooine" },
        species: null,
      },
      filmList: {
        _tag: "FilmListViewModel",
        countLabel: "2 films",
        films: [
          {
            _tag: "FilmListItemViewModel",
            episodeId: 4,
            text: "A New Hope (Episode 4)",
          },
          {
            _tag: "FilmListItemViewModel",
            episodeId: 5,
            text: "The Empire Strikes Back (Episode 5)",
          },
        ],
      },
    });
  });
});

describe("HomePageViewModel", () => {
  it("keeps films a non-empty array in the schema", () => {
    const model = presentLoadedHomePage(i18n, luke);
    const invalid = {
      ...model,
      filmList: { ...model.filmList, films: [] },
    };

    expect(() =>
      Schema.decodeUnknownSync(HomePageViewModel)(invalid),
    ).toThrow();
  });
});

describe("HomePageOptics", () => {
  it("sets and reads the form error without mutating the model", () => {
    const model = presentLoadedHomePage(makeEn(), luke);
    const updated = HomePageOptics.FormError.set("Bad id")(model);

    expect(HomePageOptics.FormError.get(updated)).toBe("Bad id");
    expect(model.form.error).toBeUndefined();
  });
});

describe("HomePage", () => {
  it("renders the loaded character and films", () => {
    const html = renderToStaticMarkup(
      <HomePage
        {...presentLoadedHomePage(i18n, luke)}
        dispatch={() => {}}
        isPending={false}
      />,
    );

    expect(html).toContain("Luke Skywalker");
    expect(html.match(/<li/g)).toHaveLength(2);
    expect(html).toContain("A New Hope (Episode 4)");
    expect(html).toContain("2 films");
    expect(html).toContain("Load character");
    expect(html).toContain("Build a dossier");
    expect(html).toContain('value="1"');
  });

  it("renders a failure with the submitted form value", () => {
    const model = makeFailedHomePageModel(i18n, { formValue: "abc" });
    expect(model).toMatchObject({
      form: {
        _tag: "SearchFormViewModel",
        value: "abc",
        submitLabel: "Try again",
      },
    });

    const html = renderToStaticMarkup(
      <HomePage {...model} dispatch={() => {}} isPending={false} />,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("The character could not be loaded.");
    expect(html).toContain("Try again");
    expect(html).toContain('value="abc"');
  });

  it("renders the pending form state", () => {
    const html = renderToStaticMarkup(
      <HomePage
        {...presentLoadedHomePage(i18n, luke)}
        dispatch={() => {}}
        isPending={true}
      />,
    );

    expect(html).toContain("Loading...");
    expect(html).toContain("disabled");
  });
});

describe("ConnectedHomePage", () => {
  it("renders the initial model", () => {
    const html = renderToStaticMarkup(
      <ConnectedHomePage {...presentLoadedHomePage(makeEn(), luke)} />,
    );

    expect(html).toContain("Luke Skywalker");
  });
});
