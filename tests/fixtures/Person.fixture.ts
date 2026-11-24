import { Schema } from "effect";
import { CharacterId, type Person } from "../../src/domain/StarWars.model";

export const makeCharacterId = (value: string): CharacterId =>
  Schema.decodeSync(CharacterId)(value);

export const luke: Person = {
  _tag: "Person",
  id: makeCharacterId("1"),
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  films: [
    { _tag: "Film", title: "A New Hope", episodeId: 4 },
    { _tag: "Film", title: "The Empire Strikes Back", episodeId: 5 },
  ],
};

export const personNamed = (id: CharacterId, name: string): Person => ({
  _tag: "Person",
  id,
  name,
  height: "170",
  mass: "70",
  films: [{ _tag: "Film", title: "A New Hope", episodeId: 4 }],
});
