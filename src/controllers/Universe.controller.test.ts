import { Option } from "effect";
import { describe, expect, it } from "vitest";
import { Universes } from "../domain/FilmUniverse.model";
import { decodeUniverse } from "./Universe.controller";

describe("decodeUniverse", () => {
  it("decodes a known universe", () => {
    expect(decodeUniverse({ universe: Universes.Ghibli })).toEqual(
      Option.some(Universes.Ghibli),
    );
  });

  it("returns none for an unknown universe", () => {
    expect(decodeUniverse({ universe: "unknown" })).toEqual(Option.none());
  });
});
