import { Schema } from "effect";
import { describe, expect, it } from "vitest";
import { Person } from "../src/domain/StarWars.model";

const person = {
  _tag: "Person",
  id: "1",
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  films: [{ _tag: "Film", title: "A New Hope", episodeId: 4 }],
};

describe("Person", () => {
  it("identifies a person with a character id string", () => {
    expect(Schema.decodeUnknownSync(Person)(person)).toMatchObject({ id: "1" });
  });

  it("rejects an id that is not a character id", () => {
    expect(() =>
      Schema.decodeUnknownSync(Person)({ ...person, id: "0" }),
    ).toThrow();
  });
});
