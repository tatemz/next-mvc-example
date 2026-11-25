import { Schema } from "effect";
import {
  CharacterId,
  TransportKinds,
  type Person,
} from "./FilmUniverse.model";

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
  origin: {
    _tag: "Origin",
    name: "Tatooine",
    climate: "arid",
    terrain: "desert",
  },
  species: null,
  films: [
    { _tag: "Film", title: "A New Hope", order: 4 },
    { _tag: "Film", title: "The Empire Strikes Back", order: 5 },
  ],
  transports: [
    {
      _tag: "Transport",
      key: "starship-12",
      kind: TransportKinds.Starship,
      name: "X-wing",
      model: "T-65 X-wing",
    },
    {
      _tag: "Transport",
      key: "vehicle-14",
      kind: TransportKinds.Vehicle,
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

export const haku: Person = {
  _tag: "Person",
  id: makeCharacterId("1"),
  name: "Haku",
  height: "170",
  mass: "60",
  birthYear: "unknown",
  gender: "male",
  origin: {
    _tag: "Origin",
    name: "Spirit World",
    climate: "misty",
    terrain: "marsh",
  },
  species: {
    _tag: "Species",
    name: "River Spirit",
    classification: "deity",
    language: "Japanese",
  },
  films: [{ _tag: "Film", title: "Spirited Away", order: 1 }],
  transports: [],
};

export const muska: Person = {
  _tag: "Person",
  id: makeCharacterId("42"),
  name: "Colonel Muska",
  height: "180",
  mass: "70",
  birthYear: "unknown",
  gender: "male",
  origin: {
    _tag: "Origin",
    name: "Laputa",
    climate: "windy",
    terrain: "mountain",
  },
  species: null,
  films: [{ _tag: "Film", title: "Castle in the Sky", order: 1 }],
  transports: [
    {
      _tag: "Transport",
      key: "4e09b023-f650-4747-9ab9-eacf14540cfb",
      kind: TransportKinds.Vehicle,
      name: "Air Destroyer Goliath",
      model: "Goliath",
    },
  ],
};
