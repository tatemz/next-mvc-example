import { it } from "@effect/vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect } from "vitest";
import { makeEn } from "../i18n/I18n.service";
import {
  makePersonViewModel,
  PersonCard,
  type PersonCardInput,
} from "./PersonCard";

const i18n = makeEn();

const input = (
  overrides: Partial<PersonCardInput> = {},
): PersonCardInput => ({
  id: "1",
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  birthYear: "19BBY",
  gender: "male",
  origin: { name: "Tatooine", climate: "arid", terrain: "desert" },
  species: null,
  films: [{ title: "A New Hope", order: 4 }],
  transports: [],
  ...overrides,
});

describe("makePersonViewModel", () => {
  it("formats known measurements", () => {
    expect(makePersonViewModel(i18n, input())).toEqual({
      _tag: "PersonViewModel",
      id: "1",
      name: "Luke Skywalker",
      height: "172",
      mass: "77",
      birthYear: "19BBY",
      gender: "male",
      heightLabel: "Height",
      massLabel: "Mass",
      birthYearLabel: "Born",
      genderLabel: "Gender",
      originLabel: "Origin",
      speciesLabel: "Species",
      speciesUnknownLabel: "Unknown species",
      origin: {
        _tag: "OriginViewModel",
        name: "Tatooine",
        climate: "arid",
        terrain: "desert",
      },
      species: null,
      films: [
        {
          _tag: "FilmListItemViewModel",
          order: 4,
          text: "A New Hope",
        },
      ],
      transports: [],
    });
  });

  it("replaces unknown measurements with a display value", () => {
    expect(
      makePersonViewModel(
        i18n,
        input({ name: "Yoda", height: "unknown", mass: "" }),
      ),
    ).toMatchObject({
      height: "Unknown",
      mass: "Unknown",
    });
  });

  it("renders a known species", () => {
    const model = makePersonViewModel(
      i18n,
      input({
        species: {
          name: "Human",
          classification: "mammal",
          language: "Galactic Basic",
        },
      }),
    );

    const html = renderToStaticMarkup(<PersonCard {...model} />);

    expect(html).toContain("Human");
  });

  it("maps the species when one is present", () => {
    expect(
      makePersonViewModel(
        i18n,
        input({
          species: {
            name: "Human",
            classification: "mammal",
            language: "Galactic Basic",
          },
        }),
      ),
    ).toMatchObject({
      species: {
        _tag: "SpeciesViewModel",
        name: "Human",
      },
    });
  });
});

describe("PersonCard", () => {
  it("renders person labels from the model", () => {
    const model = {
      ...makePersonViewModel(i18n, input()),
      heightLabel: "Tallness",
      massLabel: "Heft",
    };

    const html = renderToStaticMarkup(<PersonCard {...model} />);

    expect(html).toContain("Tallness");
    expect(html).toContain("Heft");
    expect(html).toContain("Tatooine");
    expect(html).toContain("Unknown species");
  });
});
