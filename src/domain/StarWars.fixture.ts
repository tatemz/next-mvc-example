import { Schema } from "effect";
import { CharacterId, type Person } from "./StarWars.model";

export const makeCharacterId = (value: string): CharacterId =>
  Schema.decodeSync(CharacterId)(value);

export const luke: Person = {
  _tag: "Person",
  id: makeCharacterId("1"),
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  birthYear: "19BBY",
  gender: "male",
  homeworld: {
    _tag: "Planet",
    name: "Tatooine",
    climate: "arid",
    terrain: "desert",
  },
  species: null,
  films: [
    { _tag: "Film", title: "A New Hope", episodeId: 4 },
    { _tag: "Film", title: "The Empire Strikes Back", episodeId: 5 },
  ],
  transports: [
    {
      _tag: "Transport",
      key: "starship-12",
      kind: "Starship",
      name: "X-wing",
      model: "T-65 X-wing",
    },
    {
      _tag: "Transport",
      key: "vehicle-14",
      kind: "Vehicle",
      name: "Snowspeeder",
      model: "t-47 airspeeder",
    },
  ],
};

export const personNamed = (id: CharacterId, name: string): Person => ({
  ...luke,
  id,
  name,
});
