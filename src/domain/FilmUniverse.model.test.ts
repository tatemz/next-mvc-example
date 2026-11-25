import { Schema } from "effect";
import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { CharacterId, Person } from "./FilmUniverse.model";

describe("CharacterId", () => {
  it("accepts a positive whole number written as a string", () => {
    expect(Schema.decodeSync(CharacterId)("3")).toBe("3");
  });

  it("normalizes a numeric id to its canonical string", () => {
    expect(Schema.decodeSync(CharacterId)("01")).toBe("1");
  });

  it("rejects zero", () => {
    expect(() => Schema.decodeSync(CharacterId)("0")).toThrow();
  });

  it("rejects a non-numeric id", () => {
    expect(() => Schema.decodeSync(CharacterId)("abc")).toThrow();
  });
});

const person = {
  _tag: "Person",
  id: "1",
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  birthYear: "19BBY",
  gender: "male",
  origin: {
    _tag: "Origin",
    name: "Tatooine",
    climate: "arid",
    terrain: "desert",
  },
  species: null,
  films: [{ _tag: "Film", title: "A New Hope", order: 4 }],
  transports: [],
} as const;

describe("Person", () => {
  it("identifies a person with a character id string", () => {
    expect(Schema.decodeSync(Person)(person)).toMatchObject({ id: "1" });
  });

  it("rejects an id that is not a character id", () => {
    expect(() =>
      Schema.decodeSync(Person)({ ...person, id: "0" }),
    ).toThrow();
  });
});
