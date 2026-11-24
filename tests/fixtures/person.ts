import type { Person } from "../../src/domain/Person";

export const luke: Person = {
  id: 1,
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  films: [
    { title: "A New Hope", episodeId: 4 },
    { title: "The Empire Strikes Back", episodeId: 5 },
  ],
};

export const personNamed = (id: number, name: string): Person => ({
  id,
  name,
  height: "170",
  mass: "70",
  films: [{ title: "A New Hope", episodeId: 4 }],
});
